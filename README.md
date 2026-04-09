### POST /incident

Creates a new incident.

#### Request body
```json
{
  "title": "Oil spill",
  "description": "Slippery floor near machine",
  "severity": "High",
  "file": "base64-encoded-image"
}
```

#### Response
```json
{
  "message": "Incident created successfully",
  "incidentId": "1234567890-abcd",
  "fileUrl": "https://bucket-name.s3.eu-west-2.amazonaws.com/file.jpg"
}
```# Cloud-Based Safety Incident Reporting System

A full-stack serverless web application for reporting and managing workplace safety incidents with image evidence upload.

## Overview

This project allows users to:

- Submit safety incidents
- Upload image evidence
- Store incident records in DynamoDB
- Store uploaded files in S3
- Retrieve all incidents through an API
- View incidents from a React frontend dashboard

## Architecture

React Frontend  
→ API Gateway  
→ AWS Lambda  
→ DynamoDB + S3

## Tech Stack

### Frontend
- React
- Fetch API

### Backend
- AWS Lambda (Node.js)
- Amazon API Gateway
- Amazon DynamoDB
- Amazon S3

## Features

- Incident creation
- Severity levels: Low, Medium, High
- Image upload using base64
- Data validation
- Incident listing
- Public image access for testing/demo

## API Endpoints

### POST /incident

Creates a new incident.

#### Request body
```json
{
  "title": "Oil spill",
  "description": "Slippery floor near machine",
  "severity": "High",
  "file": "base64-encoded-image"
}
### GET /incidents

Returns all incidents.

#### Response
```json
[
  {
    "incidentId": "1234567890-abcd",
    "title": "Oil spill",
    "description": "Slippery floor near machine",
    "severity": "High",
    "status": "OPEN",
    "createdAt": "2026-03-31T06:36:50.470Z",
    "imageUrl": "https://bucket-name.s3.eu-west-2.amazonaws.com/file.jpg"
  }
]
```
