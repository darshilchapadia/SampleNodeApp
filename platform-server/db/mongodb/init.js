const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const collections = require('./collections');

const URI = 'mongodb://' + config.dev.uri + ':' + config.dev.port;

var state = {};

module.exports = {
  connect: function(done) {
    if (state.db) return done()

    MongoClient.connect(URI, function(err, client) {
      if(!err) {
        console.log("Connected successfully to mongo server");
        state.db = client;
        console.log("Initializing collections...");
        for(var collection in collections) {
          collections[collection].init(client);
        }
        console.log("Collections initialized!");
      } else {
        console.log("******FAILED TO CONNECT TO MONGO SERVER*******", err);
      }
      done(err);
    });
  },

  get: function() {
    return state.db
  },

  getCollections: function() {
    return collections;
  },

  close: function(done) {
    if (state.db) {
      state.db.close(function(err, result) {
        state.db = null
        console.log("Connection closed successfully!");
        done(err)
      });
    } else {
      console.log("No connection open to be closed");
    }
  }
}
