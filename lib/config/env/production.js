'use strict';

module.exports = {
  env: 'production',
  mongo: {
    uri: process.env.CUSTOMCONNSTR_MONGOLAB_URI ||
         process.env.CUSTOMCONNSTR_MONGOHQ_URL ||
         'mongodb://localhost/fullstack'
  }
};