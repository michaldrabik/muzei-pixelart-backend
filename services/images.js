const _ = require('lodash');

class Images {
    constructor(s3) {
        this.s3 = s3
    }

    async getRandom(count) {
        const params = { "Bucket": process.env.BUCKET_NAME };
        const objects = await this.s3.listObjectsV2(params).promise()
        const items = _.sampleSize(objects.Contents, count)
        return items.map(item => this._createImageJson(item.Key, this._getUrl(item.Key)))
    }

    _getUrl(key) {
        return process.env.AWS_STAGE === 'dev' ? this._getDevUrl(key) : this._getProdUrl(key)
    }

    _getDevUrl(key) {
        return `https://s3.${process.env.BUCKET_REGION}.amazonaws.com/${process.env.BUCKET_NAME}/${key}`
    }

    _getProdUrl(key) {
        return `https://${process.env.AWS_CDN}/${key}`
    }

    _createImageJson(id, url) {
        return { id, url }
    }
}

module.exports = Images