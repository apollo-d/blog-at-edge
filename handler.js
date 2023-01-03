'use strict';
const zlib = require('zlib');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

module.exports.blog = async (event) => {
  const cfRequest = event.Records[0].cf.request;
  console.log(cfRequest);
  const uri = cfRequest.uri.match(/^\/$/) ? 'index' : cfRequest.uri.replace(/^\/+/, '');
  let content;
  try {
    content = await readFile(`${uri}.html`, 'utf8');
  } catch (e) {
    content = await readFile('error.html', 'utf8')
  } finally {
    const buffer = zlib.gzipSync(content); 
    const base64EncodedBody = buffer.toString('base64');
    const response = {
      headers: {
        'content-type': [{key:'Content-Type', value: 'text/html; charset=utf-8'}],
        'content-encoding' : [{key:'Content-Encoding', value: 'gzip'}]
      },
      status: 200,
      statusDescription: "OK",
      body: base64EncodedBody,
      bodyEncoding: 'base64',
    };
    console.log(response);
    return response;
  }
}