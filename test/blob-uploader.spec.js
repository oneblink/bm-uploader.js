'use strict'

/* eslint-disable */
describe('blobuploader', () => {

  var originalTimeout;
    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    })

    afterEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    })
    
  describe('Constructor', () => {
    it('should throw a type error if no url is supplied', () => {
      expect(() => { blobUploader() }).toThrow()
    })

    it('should succeed if url is supplied', () => {
      expect(() => { blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/v1/signedURL/') }).toBeDefined()
      // expect(() => { var a = true }).toThrow()
    })
  })

  describe('uploadBlob', () => {
    it('should reject if blob not passed in', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/v1/signedURL/')
      uploader.uploadBlob()
        .then((id) => { done.fail() })
        .catch((err) => { done() })
    })

    it('should succeed when given a blob', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/v1/signedURL/')
      try {
      uploader.uploadBlob(new Blob(['111']))
        .then((id) => {
          expect(id.length).toBeGreaterThan(0)
          done()
        })
        .catch((err) => { done.fail(err) })
      }
      catch(e) {
        done.fail(e)
      }
    })
  })

  describe('retrieveBlobUrl', () => {
    it('should reject if uuid not passed in', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/v1/signedURL/')
      uploader.retrieveBlobUrl()
        .then((blob) => { done.fail() })
        .catch((err) => { done() })
    })

    it('should succeed when given a valid uuid', (done) => {
      const uploader = new blobUploader('https://bm-blob-uploader-dev.api.blinkm.io/v1/signedURL/')
      try {
      uploader.uploadBlob(new Blob(['111']))
        .then((id) => {
          expect(id.length).toBeGreaterThan(0)
          uploader.retrieveBlobUrl(id)
            .then((url) => {
              expect(url).toBeDefined()
              done()
            })
            .catch((err) => { done.fail(err) })
        })
        .catch((err) => { done.fail(err) })
      }
      catch(e) {
        done.fail(e)
      }
    })
  })
})
/* eslint-disable */
