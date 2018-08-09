const ObjectId = require('mongodb').ObjectId;
var config = require('./config');
var state = {};

module.exports = {
  init: function (dbClient) {
    state.dbClient = dbClient;
    state.collection = dbClient.db(config.db).collection(config.collection);
  },

  findDocument: function (filter, fields, callback) {
    if(filter.key) {
      filter._id = ObjectId(filter.key);
      delete filter.key;
    }

    var options = {
      projection: fields
    }

    state.collection.findOne(filter, options, function(err, result) {
      if(!err) {
        console.log('Inserted a document into the collection', result);
      } else {
        console.log('Failed to insert document!!', err);
      }
      callback(err, result);
    });
  },

  findDocuments: function (filter, fields, offset, limit, callback) {
    if(filter.key) {
      filter._id = ObjectId(filter.key);
      delete filter.key;
    }

    offset = offset || 0;
    limit = limit || 10;

    state.collection.find(filter).project(fields).skip(offset).limit(limit).toArray(function(err, result) {
      if(!err) {
        console.log('Inserted a document into the collection');
      } else {
        console.log('Failed to insert document!!', err);
      }

      result.forEach(doc => {
        doc.key = doc._id;
        delete  doc._id;
      });

      callback(err, result);
    });
  },

  findDocumentsWithAggregation: function (fields, aggFields, offset, limit, callback) {

    offset = offset || 0;
    limit = limit || 10;
    aggFields = aggFields || [];

    Object.keys(aggFields).forEach(function(field) {
      fields[field] = {
        "$size": "$" + field
      }
    });

    var aggFramework = [
      { "$limit": offset + limit },
      { "$skip": offset },
      { "$project": fields }
    ]

    state.collection.aggregate(aggFramework).toArray(function(err, result) {
      if(!err) {
        console.log('Inserted a document into the collection');
      } else {
        console.log('Failed to insert document!!', err);
      }

      result.forEach(doc => {
        doc.key = doc._id;
        delete  doc._id;
      });

      callback(err, result);
    });
  },

  insertDocument: function(data, callback) {
    state.collection.insertOne(data, function(err, result) {
      if(!err) {
        console.log('Inserted a document into the collection', result);
      } else {
        console.log('Failed to insert document!!', err);
      }
      callback(err, result);
    });
  },

  insertDocuments: function (data, callback) {
    state.collection.insertMany(data, function(err, result) {
      if(!err) {
        console.log('Inserted', data.length, 'documents into the collection', result);
        callback(result);
      } else {
        console.log('Failed to insert documents!!', err);
      }
    });
  },

  updateDocument: function (filter, update, callback) {

    if(filter.key) {
      filter._id = ObjectId(filter.key);
      delete filter.key;
    }

    update = {
      '$set': update
    }

    var options = {
      upsert: true
    }

    state.collection.updateOne(filter, update, options, function(err, result) {
      if(!err) {
        console.log('Updated documents');
      } else {
        console.log('Failed to update documents!!', err);
      }
      callback(err, result);
    });
  },

  addToSet: function (filter, values, callback) {

    if(filter.key) {
      filter._id = ObjectId(filter.key);
      delete filter.key;
    }

    var update = {
      '$addToSet': values
    };

    var options = {};

    state.collection.updateOne(filter, update, options, function(err, result) {
      if(!err) {
        console.log('Updated documents');
      } else {
        console.log('Failed to update documents!!', err);
      }
      callback(err, result);
    });
  },

  deleteDocument: function (filter, callback) {

    if(filter.key) {
      filter._id = ObjectId(filter.key);
      delete filter.key;
    }

    var options = {};

    state.collection.findOneAndDelete(filter, options, function(err, result) {
      if(!err) {
        console.log('Deleted documents');
      } else {
        console.log('Failed to delete documents!!', err);
      }
      callback(err, result);
    });
  }
}
