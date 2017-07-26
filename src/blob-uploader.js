'use strict'

const privateVars = new WeakMap()

function blobUploader (apiUrl) {
  if (!apiUrl) {
    throw new TypeError('blobUploader expects a api URL during instansiation')
  }
  privateVars.set(this, {
    uri: apiUrl
  })
}

blobUploader.prototype.uploadBlob = function (blob) {
  if (!blob) {
    return Promise.reject(new Error('blob argument not passed in'))
  }

  const request = new Request(privateVars.get(this).uri, {
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    headers: new Headers({
      'Content-Type': 'text/plain'
    })
  })

  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(new Error('Error calling blob api service: ' + response.status + ' ' + response.statusText))
      }
      return response.json()
    }).then((apiResponse) => {
      this._uploadToS3(blob, apiResponse.putUrl)
      return apiResponse.id
    })
    .catch((err) => new Error('Error calling blob api service: ', err))
}

blobUploader.prototype._uploadToS3 = function (blob, url) {
  const request = new Request(url, {
    method: 'PUT',
    mode: 'cors-with-forced-preflight',
    redirect: 'follow',
    body: blob,
    headers: new Headers({
      'Content-Type': ' '
    })
  })

  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        return Promise.reject(Error('Error uploading to S3: ' + response.status + ' ' + response.statusText))
      }
    })
    .catch((err) => new Error('Error uploading to S3: ', err))
}

module.exports = blobUploader
