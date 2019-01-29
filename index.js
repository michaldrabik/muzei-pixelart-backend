const AWS = require('aws-sdk');
const _ = require('lodash');
const Images = require('./services/images');

const images = new Images(new AWS.S3())

const DEFAULT_COUNT = 1

module.exports.handler = async (event) => {
	const count = _.get(event, 'queryStringParameters.count', DEFAULT_COUNT)
	const randomItems = await images.getRandom(count)
	return createResponse(randomItems)
};

const createResponse = (items) => ({
	"statusCode": 200,
	"body": JSON.stringify(items)
})