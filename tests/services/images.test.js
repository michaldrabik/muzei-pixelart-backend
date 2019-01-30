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
    const items = await SUT.getRandomImages(2)

    expect(items.length).toBe(2);
});

test('Should return random image each call', async () => {
    const items1 = await SUT.getRandomImages(1)
    const items2 = await SUT.getRandomImages(1)

    expect(items1).not.toEqual(items2)
    expect(items1.length).toEqual(items2.length);
});

test('Should strip extension when creating and ID', async () => {
    const id = SUT._getKeyId('somekey.jpg')
    const id2 = SUT._getKeyId('somekey.png')
    const id3 = SUT._getKeyId('somekey.jpeg')

    expect(id).toBe('somekey')
    expect(id2).toBe('somekey')
    expect(id3).toBe('somekey')
});

test('Should create proper URL when stage is development', async () => {
    process.env.AWS_STAGE = 'dev'
    const url = SUT._getUrl('somekey.jpg')
    
    expect(url).toBe('https://s3.test_bucket_region.amazonaws.com/test_bucket_name/somekey.jpg')
});

test('Should create proper URL when stage is production', async () => {
    process.env.AWS_STAGE = 'prod'
    const url = SUT._getUrl('somekey.jpg')
    
    expect(url).toBe('https://test_aws_cdn/somekey.jpg')
});