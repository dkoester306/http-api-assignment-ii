const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses');
const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response) => {
  // check if we have required parameters in the body
  const res = response;
  // uploaded data comes in a byte stream. SO we need to
  // reassemble onces its all arrived
  const body = [];
  // check for error in upload stream
  // throw bad request and send it back
  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  // on 'data' is for each byte of data that comes in from upload
  // We will add it to our byte array
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // on end of upload stream
  request.on('end', () => {
    // combine our byte array (Buffer.concat) and convert it to a string (might not always be a string value)
    const bodyString = Buffer.concat(body).toString();

    // sincer we are getting x-www-form-urlencoded, the format will be the same as queryStrings
    // parse the string iunto an object by field name
    const bodyParams = query.parse(bodyString);
    responses.addUser(request, response, bodyParams);
  });
};


const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': responses.getUsers,
    notFound: responses.notFound,
  },
  HEAD: {
    '/getUsers': responses.getUsersMeta,
    notFound: responses.getNotFoundMeta,
  },
  POST: {
    '/addUser': handlePost,
    notFound: responses.notFound,
  },


};


const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  console.log(`(Method: ${request.method}, URL: ${parsedUrl.pathname})`);
  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};


http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
