'use strict';
var url = require('url');

module.exports = {

	decodeQuerStringParams : function(queryString) {
		var data = "?" + queryString
    var decoded_data = decodeURI(data)
    var url_parts = url.parse(decoded_data, true);
    var params = url_parts.query;
		return params
	},
}
