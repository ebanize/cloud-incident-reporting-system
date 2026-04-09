const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const dynamoClient = new DynamoDBClient({ region: "eu-west-2" });
const s3Client = new S3Client({ region: "eu-west-2" });

const BUCKET_NAME = "incident-reporting-ebanize";

exports.handler = async (event) => {
    const method = event.requestContext?.http?.method;

// ✅ HANDLE GET REQUEST
if (method === "GET") {
    const { ScanCommand } = require("@aws-sdk/client-dynamodb");

    const data = await dynamoClient.send(new ScanCommand({
        TableName: "Incidents"
    }));

    const items = data.Items.map(item => ({
        incidentId: item.incidentId.S,
        title: item.title.S,
        description: item.description.S,
        severity: item.severity.S,
        status: item.status.S,
        createdAt: item.createdAt.S,
        imageUrl: item.imageUrl ? item.imageUrl.S : null
    }));

    return {
        statusCode: 200,
        body: JSON.stringify(items)
    };
}
    try {
        let body = event.body ? JSON.parse(event.body) : event;

        // ✅ VALIDATION
        if (!body.title || !body.description) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "title and description are required"
                })
            };
        }

        const validSeverities = ["Low", "Medium", "High"];

        if (!validSeverities.includes(body.severity)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Invalid severity. Use Low, Medium, or High"
                })
            };
        }

        const incidentId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

        let fileUrl = null;

        if (body.file) {
            const fileBuffer = Buffer.from(body.file, "base64");
            const fileName = `incident-${incidentId}.jpg`;

            await s3Client.send(new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: fileBuffer,
                ContentType: "image/jpeg"
            }));

            fileUrl = `https://${BUCKET_NAME}.s3.eu-west-2.amazonaws.com/${fileName}`;
        }

        const item = {
            incidentId: { S: incidentId },
            title: { S: body.title },
            description: { S: body.description },
            severity: { S: body.severity },
            status: { S: "OPEN" },
            createdAt: { S: new Date().toISOString() }
        };

        if (fileUrl) {
            item.imageUrl = { S: fileUrl };
        }

        await dynamoClient.send(new PutItemCommand({
            TableName: "Incidents",
            Item: item
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Incident created successfully",
                incidentId,
                fileUrl
            })
        };

    } catch (error) {
        console.error("ERROR:", error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error",
                error: error.message
            })
        };
    }
};
