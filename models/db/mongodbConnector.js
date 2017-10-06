var MongoClient = require('mongodb').MongoClient;
var url = ''
if(typeof global.conf.mainConfig.databases.mongodb == "undefined") {
	global.registry.logger.throw('No mongodb config object in global.conf.mainConfig.databases !');
}
var _cfg = global.conf.mainConfig.databases.mongodb

function init(onConnectFunction) {
	url = url || _cfg.connection_url
	MongoClient.connect(url, function(err, db) {
		onConnectFunction(err, db);
	});
}


module.exports = {

	createCollection: function (docObject, collectionName, callback) {
		init(function(err, db) {
		  if (err) throw err;
		  db.collection(collectionName).insert(docObject, function(err, res) {
		    if (err) throw err;
		    db.close();
				var data = {'error': err}
				callback(data)
		  });
		});
  },

	find: function(searchObject, collectionName, callback) {
		init(function(err, db) {
		  if (err) throw err;
		  db.collection(collectionName).find(searchObject).toArray(function(err, result) {
		    if (err) throw err;
		    db.close();
				var data = {'error': err, 'result': result}
				callback(data)
		  });
		});
  },


	update: function(matchObject, updateObject, collectionName, callback) {
		init(function(err, db) {
			if (err) throw err;
			db.collection(collectionName).update(matchObject, {$set:updateObject}, function(err, result){
				var data = {'error': err, 'result': result[0]}
				callback(data)
			})
		});
	},

	removeFromCollection: function(matchObject, collectionName, callback) {
		init(function(err, db) {
		  if (err) throw err;
		  db.collection(collectionName).remove(matchObject, function(err, res) {
		    if (err) throw err;
		    db.close();
				var data = {'error': err}
				callback(data)
		  });
		});
	},

	getObjectId: function(objectIdString) {
		var ObjectID = require('mongodb').ObjectID;
		var o_id = new ObjectID(objectIdString);
		return o_id;
	},

}
