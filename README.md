# Muzei Pixelart Serverless Lambda

Simple AWS Lambda that fetches S3-stored images and returns response for API Gateway.

## Setup

Use **Node v8.1.0** or higher.

Run ```npm install```

Following ENV variables are required:

**AWS_REGION**=*e.g.* eu-central-1  
**AWS_STAGE**=*e.g.* dev  
**BUCKET_NAME**=*e.g.* s3-images-bucket  
**API_KEY**=yourapikey