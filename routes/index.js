'use strict';

global.registry.logger.log('Routes sub-module loaded!');

const express = require('express');
const routes = express.Router();
const templateBuilder = require('../templateBuilder');

var _cfg = global.conf

routes.setupRoutes = function() {
	templateBuilder.setup()

	// set up route mapping
	for(var count in _cfg.routes) {
		routes.get(_cfg.routes[count].pattern, function (req, res) {

			var pattern = matchPattern(req.url, _cfg.routes)
			var controllerFile = _cfg.paths.appRoot + '/controllers/' + pattern.controller + '.js'
			var templateFile = pattern.template
			var controller = require(controllerFile);
			controller.init(req, function(data) {
				//global.registry.logger.log(data.result, 2)

				//global.registry.logger.log(data.data.result.templateFile, 3);
				if(typeof data != 'undefined' && typeof data.templateFile != 'undefined') {
					templateFile = data.data.result.templateFile
				}
				// once controller has data back, continue with building the template
				templateBuilder.build(templateFile, data, function(dataHTML) {
					// on success render the html
					res.send(dataHTML)
				})
			})
		})
	}

	// serve static content
	routes.use('/' + _cfg.mainConfig.app.directories.public, express.static(_cfg.mainConfig.app.directories.public))

/*
	routes.get('/public/*', function (req, res) {
		res.send("!!!!")
	})
*/

	/*
	for(var q=0;q < 5; q++) {
		eval("routes.get('/ttt.ttt' + q, function (req, res) { console.log(req.url);res.send('tt " + q + "');})");
	}
	*/

	/*
	routes.all('/test/*', function (req, res, next) {
		res.send("TEST!!!!")
	})


	routes.all('/secret', function (req, res, next) {
	  console.log('Accessing the secret section ...')
	  //next() // pass control to the next handler
		res.send("tt" + next)
	})
	*/
}

function matchPattern(request, routes) {
	for(var q in routes) {
		var p = routes[q].pattern.split('/').join('\/')
		if(request.match(routes[q].pattern)) {
			return routes[q]
		}
	}
}

module.exports = routes;
