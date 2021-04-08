# Blog@Edge

Blog@Edge is a POC site that is served directly from CloudFront Edge from a "viewer-request"-type Lambda.

While CloudFront requires an "origin" in order to setup a distribution, this application never touches an "origin" (ex: S3) - just pure lambda-ness!

The performance benefits for this approach are nominal at best: the application never has to make those "latent" round trip requests to retrieve files from a Region; it always stays at the Edge.

Best use cases for "viewer-request" lambdas are when you need to dynamically alter a response, for low-compute, light data scenarios (response MUST be <40kb).

The result of Blog@Edge is a gzipped compressed microblog that is available at and served from over 100 edge locations worldwide.


#### Demo - [http://d18ysengjg5rtu.cloudfront.net/](http://d18ysengjg5rtu.cloudfront.net/)
- Post Page [http://d18ysengjg5rtu.cloudfront.net/test-post](http://d18ysengjg5rtu.cloudfront.net/test-post)
- Error Page [http://d18ysengjg5rtu.cloudfront.net/error](http://d18ysengjg5rtu.cloudfront.net/error)

#### Usage

Pre-requisite: Install [Serverless framework](https://serverless.com)

``` bash
$ npm install serverless -g
```

Clone this repo and install the NPM packages.

``` bash
$ git clone https://github.com/pauldiehl/blog-at-edge
```

Test locally

``` bash
node -e 'require("./handler").blog(require("./mock-event.json"))'
```

Where, `mock-event.json`, contains the request event info. 
Try changing the "uri" to "/", "/test-post", or "/page-not-found"

``` json
{
  "Records": [{
    "cf": {
      "request": {
          "uri" : "/"
      }
    }
  }]
}
```

Finally, run this to deploy to your AWS account.

``` bash
$ serverless deploy
```

#### Important Limitations
Viewer request and response event quotas:
- Function memory size: 128mb
- Function timeout: 5sec
- **Size of a response (including headers and body): 40kb**
- Maximum compressed size of a Lambda function and any included libraries: 1mb
- [Read more about limits](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html#limits-lambda-at-edge)

Additionally, this application does not leverage caching:
- Ideally, routing should direct to an existing resource on the origin server (i.e., S3). 
- Currently, AWS does not provide the response body for a "Viewer Response" lambda to be able to manipulate the info.
- [Read more on CloudFront Dev Guide](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AmazonCloudFront_DevGuide.pdf)

#### CREDIT:
Used Pure CSS example to demonstrate a blog site.

[https://github.com/pure-css/pure/tree/master/site/static/layouts/blog](https://github.com/pure-css/pure/tree/master/site/static/layouts/blog)
