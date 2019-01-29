const AWS = require('aws-sdk');
const sinon = require('sinon');

const env = require('../stubs/env');
const stubs = require('../stubs/s3');

const Images = require('../../services/images');

const S3 = new AWS.S3()
const SUT = new Images(S3)

beforeAll(() => {
    process.env = env

    let stub = sinon.stub(S3, 'listObjectsV2')
    stub.withArgs({ "Bucket": env.BUCKET_NAME }).returns({
        promise: () => { return stubs.imageObjects }
    })
});

test('Should return proper amount of random images', async () => {
    const items = await SUT.getRandom(2)
    expect(items.length).toBe(2);
});

test('Should return random image each call', async () => {
    const items1 = await SUT.getRandom(1)
    const items2 = await SUT.getRandom(1)
    expect(items1).not.toEqual(items2)
    expect(items1.length).toEqual(items2.length);
});