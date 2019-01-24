const AWS = require('aws-sdk');
const _ = require('lodash');

const s3 = new AWS.S3();
const DEFAULT_COUNT = 1

module.exports.handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME
    const count = _.get(event, 'queryStringParameters.count', DEFAULT_COUNT)
    const params = { "Bucket": bucketName };

    const objects = await s3.listObjectsV2(params).promise()
    const items = objects.Contents
    const randomItems = _.sampleSize(items, count)
    
    const bucketLocation = await s3.getBucketLocation(params).promise()
    const locationName = bucketLocation.LocationConstraint

    const responseBody = randomItems.map(item => {
        return {
            "id": item.Key,
            "url": `https://s3.${locationName}.amazonaws.com/${bucketName}/${item.Key}`
        }
    })

    return createResponse(200, responseBody)
};

function createResponse(statusCode, body) {
    return {
        "statusCode": statusCode,
        "body": JSON.stringify(body)
    };
}