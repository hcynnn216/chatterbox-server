/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var obj = {
  createdAt: '2016-06-28T03:45:08.996Z',
  objectId: '1',
  roomname: 'lobby',
  username: 'anonymous',
  text: 'some text message',
  updatedAt: '2016-06-28T03:45:08.996Z'
};

var msgCounter = 0;
var msgStorage = [];
msgStorage.push(obj);
var address = '/?order=-createdAt';
var statusCode = 200;
var stringified;
var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  
  var body = '';
  var jsonObj;
  // The outgoing status.
  if (false) {
    console.log(request.url);
    statusCode = 404;
  } else {
    if (request.method === 'POST') {
      statusCode = 201;
      request.on('data', function(chunk) {
        body += chunk;
      });
      // var jsonObj = JSON.parse(body);
      request.on('end', function() {
        jsonObj = JSON.parse(body);
        var d = new Date();
        var msgObj = {
          createdAt: d,
          objectId: msgCounter++,
          roomname: jsonObj.roomname,
          username: jsonObj.username,
          text: jsonObj.text,
          updatedAt: d
        };
        
        msgStorage.push(msgObj);
      });


      
      // console.log(msgStorage);

      console.log('Serving request type ' + request.method + ' for url ' + request.url);


      // stringified = 'received data';
    } else if (request.method === 'GET') {
      statusCode = 200;
      var returnMsg = {};
      returnMsg.results = msgStorage;
      stringified = JSON.stringify(returnMsg);
    }
  }

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  if (stringified) {
    console.log(stringified);
    response.end(stringified);
  } else {
    response.end('No message was posted yet.');
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept', 
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
