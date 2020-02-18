// const query = require('querystring');

const users = {};

// #region  respond Methods
const respondJSON = (request, response, content, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(content));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const successContent = (messageString) => {
  const jsonContent = {
    message: messageString,
  };
  return jsonContent;
};

const errorContent = (messageString, idString) => {
  const jsonContent = {
    message: messageString,
    id: idString,
  };
  return jsonContent;
};

// #endregion


// #region HEAD methods
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

const getNotFoundMeta = (request, response) => respondJSONMeta(request, response, 404);
// #endregion

// #region GET methods
const getUsers = (request, response) => {
  const respondContent = {
    users,
  };
  return respondJSON(request, response, respondContent, 200);
};

const notFound = (request, response) => {
  const respondContent = errorContent('The page you are looking for was not found.', 'notFound');
  return respondJSON(request, response, respondContent, 404);
};
// #endregion

// #region POST methods
const addUser = (request, response, body) => {
  // should get the new content from the request?
  // const body = getBody(request, response);
  // check if required parameters for body exist
  if (!body.name || !body.age) {
    const respondContent = errorContent('Name and age are both required.', 'missingParams');
    return respondJSON(request, response, respondContent, 400);
  }

  // default code
  let responseCode = 201;
  // if the user's name enters here already exists, switch to a 204
  if (users[body.name]) {
    responseCode = 204;
  } else {
    // otherwise create a new object with that name
    users[body.name] = {};
  }
  // add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].age = body.age;
  // if response is created, then set our create message and sent response with a message
  if (responseCode === 201) {
    const respondContent = successContent('Created successfully.');
    return respondJSON(request, response, respondContent, responseCode);
  }

  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 with a message
  // 204 will not alter the browser in any way!!!!!!!!!!!
  return respondJSONMeta(request, response, responseCode);
};
// #endregion


module.exports = {
  getUsers,
  notFound,
  addUser,
  getUsersMeta,
  getNotFoundMeta,
};
