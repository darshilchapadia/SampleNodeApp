const db = require('../db/init').getDatabase();
const collections = db.getCollections();
const baseCollecion = 'blogs';

module.exports = {
  fetchAll: function (req, res) {
    console.log("fetchAll");
    var fields = {title:1,category:1,thumbnail:1,createdOn:1,desc:1,upVotes:1,downVotes:1,author:1}
    var aggFields = {views:1}
    var offset = parseInt(req.query.offset);
    var limit = parseInt(req.query.limit);
    collections.blogs.findDocumentsWithAggregation(fields, aggFields, offset, limit, function(err, result) {
      if(err) {
        res.json({
          status: 'error',
          result: {
            shortMsg: "Failed to fetch documents.",
            message: err.message
          }
        })
      } else {
        res.json({
          status: 'ok',
          result: result
        })
      }
    })
  },

  fetchById: function (req, res) {
    var filter = {
      key: req.params.blogId,
    };
    var fields = {};
    var clientIP = req.ip;

    collections.blogs.findDocument(filter, fields, function(err, result) {
      if(err) {
        res.json({
          status: 'error',
          result: {
            shortMsg: "Failed to fetch document.",
            message: err.message
          }
        })
      } else {
        res.json({
          status: 'ok',
          result: result
        })
      }
    })

    var values = {
      views: clientIP
    }

    collections.blogs.addToSet(filter, values, function(err, result) {
      if(err) {
        console.log("Failed to update the views");
      } else {
        console.log("Successfully updated the views");
      }
    })
  },

  createNew: function (req, res) {
    console.log("createNew");
    var data = {
      title: req.body.title,
      desc: req.body.desc,
      bannerImage: req.body.bannerImage || "",
      thumbnail: req.body.thumbnail || "",
      category: req.body.category || "",
      // content: JSON.parse(req.body.content),
      createdOn: req.body.createdOn,
      author: req.body.author,
      views: [],
      upVotes: 0,
      downVotes: 0
    }
    collections.blogs.insertDocument(data, function(err, result) {
      if(err) {
        res.json({
          status: 'error',
          result: {
            shortMsg: "Failed to insert document.",
            message: err.message
          }
        })
      } else {
        res.json({
          status: 'ok',
          result: {
            id: result.insertedId.toString()
          }
        })
      }
    })
  },

  updateById: function (req, res) {
    console.log("updateById");
    var filter = {
      key: req.params.blogId,
    };

    var update = JSON.parse(req.body.update);

    collections.blogs.updateDocument(filter, update, function(err, result) {
      if(err) {
        res.json({
          status: 'error',
          result: {
            shortMsg: "Failed to update document.",
            message: err.message
          }
        })
      } else {
        res.json({
          status: 'ok',
          result: result
        })
      }
    })
  },

  deleteById: function (req, res) {
    console.log("deleteById");
    var filter = {
      key: req.params.blogId,
    };

    collections.blogs.deleteDocument(filter, function(err, result) {
      if(err) {
        res.json({
          status: 'error',
          result: {
            shortMsg: "Failed to delete document.",
            message: err.message
          }
        })
      } else {
        res.json({
          status: 'ok',
          result: result
        })
      }
    })
  }
}

