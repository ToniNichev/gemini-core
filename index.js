'use strict';

if(typeof global.conf == 'undefined') {
	// load global config before anything else since modules rely on it
	global.conf = require('gemini/configurator.js');
	global.registry = {} // create registry for all shared resourses
	global.registry.logger = require('gemini/utils/logger');
}

var _cfg = global.conf

const app = require('express')();
const routes = require('gemini/routes');

routes.setupRoutes()


//routes.setupRoutes()
// create server and socket connector
var server = require('http').createServer(app);
const io = require('socket.io')(server);

//  Connect all our routes to our application
app.use('/', routes);



io.on('connection', function(socket) {


	var onevent = socket.onevent;
	socket.onevent = function (packet) {
	    var args = packet.data || [];
	    onevent.call (this, packet);    // original call
	    packet.data = ["*"].concat(args);
	    onevent.call(this, packet);      // additional call to catch-all
	};

	socket.on("*", function(message, data) {


		for(var count in _cfg.messages) {
			if(_cfg.messages[count].message == message) {
				//socket.emit("test", message +  " >>> " + data);
				var controllerFile = _cfg.paths.appRoot + '/messageControllers/' + _cfg.messages[count].controller + '.js'
				var controller = require(controllerFile);

				var socketClient =  {
					emit: function(emitMessageName, messageObject) {
						var msgString = JSON.stringify(messageObject)
						socket.emit(emitMessageName, msgString);
					},

					broadcast: function(emitMessageName, messageObject) {
						var msgString = JSON.stringify(messageObject)
						io.emit(emitMessageName, msgString);
					}
				}

				controller.init(data, socketClient);
			}
		}
	});

	/*
	for(var count in _cfg.messages) {
		var message = _cfg.messages[count].message
		var controllerFile = _cfg.paths.appRoot + '/messageControllers/' + _cfg.messages[count].controller + '.js'

		//var f = 'client.on("' + message + '", function(data) { var controller = require("' + controllerFile + '"); controller.init(data, client);    });'
		//var codeStr = 'client.on("' + message + '", function(data) { var controller = require("' + controllerFile + '"); controller.init(data, global.registry.socketClient);  });'
		//eval(codeStr)


		client.on(message, function(data) {
			var controller = require(controllerFile);
			controller.init(data, global.registry.socketClient);
		});

	}
	*/

});

var port = 8181;
server.listen(port, () => {
  console.log('App listening on port ' + port);
});
