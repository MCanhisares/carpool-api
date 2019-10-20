"use strict";

const aws = require("aws-sdk");
const qrCode = require("qrcode");
const uuid = require("uuid");
const dynamoDb = require("./dynamodb");
const utils = require("./utils")
const tableName = process.env.DYNAMODB_TABLE;

module.exports.create = (event, context, callback) => {
  const { position } = JSON.parse(event.body);
  if (typeof position !== "string") {
    console.error("Validation failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't create a ride. Provide a valid position."
    });
    return;
  }
  const rideId = uuid.v4();

  const params = {
    TableName: tableName,
    Item: {
      rideId: rideId,
      driverLoc: position
    }
  };

  dynamoDb.put(params, error => {
    if (error) {
      console.log(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Could not create a ride. Please try again later."
      });
      return;
    }
    qrCode
      .toDataURL(rideId)
      .then(url => {
        const response = {
          statusCode: 200,
          body: JSON.stringify({ qrCode: url, id: rideId, position: position })
        };
        callback(null, response);
      })
      .catch(err => {
        console.log(err);
        callback(null, {
          statusCode: err || 501,
          headers: { "Content-Type": "text/plain" },
          body: "Error while creating the QR code! Please try again!"
        });
      });
  });
};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: tableName,
    Key: {
      rideId: event.pathParameters.id
    }
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the ride. Try again later"
      });
      return;
    }

    console.log(result);
    const response = {
      statusCode: 200,
      body: JSON.stringify({...result.Item, distance: result.Item ? utils(result.Item.driverLoc, result.Item.passengerLoc) : null})
    };
    callback(null, response);
  });
};

module.exports.scanPassenger = (event, context, callback) => {
  const { position } = JSON.parse(event.body);
  if (typeof position !== "string") {
    console.error("Validation failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't scan passenger. Provide a valid position."
    });
    return;
  }

  const params = {
    TableName: tableName,
    Key: {
      rideId: event.pathParameters.id
    },
    ExpressionAttributeNames: {
      "#passengerLoc": "passengerLoc"
    },
    ExpressionAttributeValues: {
      ":loc": position      
    },
    UpdateExpression:
      "SET #passengerLoc = :loc",
    ReturnValues: "ALL_NEW"
  };

  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t update the ride.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({ ...result.Attributes, distance: utils(result.Attributes.driverLoc, result.Attributes.passengerLoc)}),
    };
    callback(null, response);
  });
};


module.exports.confirmPassenger = (event, context, callback) => {  
  const params = {
    TableName: tableName,
    Key: {
      rideId: event.pathParameters.id
    },
    ExpressionAttributeNames: {
      "#passengerConfirm": "passengerConfirm"
    },
    ExpressionAttributeValues: {
      ":status": true      
    },
    UpdateExpression:
      "SET #passengerConfirm = :status",
    ReturnValues: "ALL_NEW"
  };

  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t update the ride.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({ ...result.Attributes, distance: utils(result.Attributes.driverLoc, result.Attributes.passengerLoc)}),
    };
    callback(null, response);
  });
};

module.exports.confirmDriver = (event, context, callback) => {  
  const params = {
    TableName: tableName,
    Key: {
      rideId: event.pathParameters.id
    },
    ExpressionAttributeNames: {
      "#driverConfirm": "driverConfirm"
    },
    ExpressionAttributeValues: {
      ":status": true      
    },
    UpdateExpression:
      "SET #driverConfirm = :status",
    ReturnValues: "ALL_NEW"
  };

  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t update the ride.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({ ...result.Attributes, distance: utils(result.Attributes.driverLoc, result.Attributes.passengerLoc)}),
    };
    callback(null, response);
  });
};