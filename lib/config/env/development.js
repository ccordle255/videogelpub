'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: process.env.CUSTOMCONNSTR_MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         'mongodb://localhost/fullstack-dev'
  }
};