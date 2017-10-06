'use strict';

var appRoot = process.env.PWD;
const route_table = require(appRoot + '/config/routes_table.js');
const messages_table = require(appRoot + '/config/messages_table.js');
const main_config = require(appRoot + '/config/main_config.js');


var config = {
	"paths" : {
		"appRoot"	 : appRoot,
		"public" : "/public",
		"templates" : "/templates"
	},
	"routes": route_table.routes,
	"messages": messages_table.messages,
	"mainConfig" : main_config
}

module.exports = config
