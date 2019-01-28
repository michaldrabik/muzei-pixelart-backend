const AWS = require('aws-sdk');
const _ = require('lodash');

const s3 = new AWS.S3();
const DEFAULT_COUNT = 1

module.exports.handler = async (event) => {
	const count = _.get(event, 'queryStringParameters.count', DEFAULT_COUNT)
	const params = { "Bucket": process.env.BUCKET_NAME };

	const objects = await s3.listObjectsV2(params).promise()
	const items = objects.Contents
	const randomItems = _.sampleSize(items, count)

	return createResponse(randomItems)
};

const createResponse = (items) => {
	const body = createResponseBody(items)
	return {
		"statusCode": 200,
		"body": JSON.stringify(body)
	}
}

const createResponseBody = (items) =>
	items.map(item => ({
		"id": item.Key,
		"url": getUrl(item.Key)
	}));

const getUrl = (key) =>
	process.env.AWS_STAGE === 'dev' ? getDevUrl(key) : getProdUrl(key)

const getDevUrl = (key) =>
	`https://s3.${process.env.BUCKET_REGION}.amazonaws.com/${process.env.BUCKET_NAME}/${key}`

const getProdUrl = (key) =>
	`https://${process.env.AWS_CDN}/${key}`