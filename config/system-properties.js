'use strict';

var serverSettings;

serverSettings = {
  dev: {
    port: 3000,
    hostname: 'http://localhost',
    listenAddress: 'localhost',
    registrationTokenSecret	: 'thankgoditsmonday1729',
    sessionTokenSecret: 'thank1god7its2monday9',
    registrationTokenExpiry: '10m',
    sessionTokenExpiry: '1h',
    //database: 'mongodb://localhost:27017/stackshare',
    // mongo ds131687.mlab.com:31687/stackshare -u username -p password
    database: 'mongodb://username:password!@ds131687.mlab.com:31687/stackshare',
    version	: 'v1'
  },
  test: {
    port: 3000,
    hostname: 'http://test.server.io',
    listenAddress: 'localhost'
  },
  prod: {
    port: 80,
    hostname: 'http://test.server.io',
    listenAaddress: '0.0.0.0'
  }
};

module.exports = serverSettings;