//console.log("templateBuilder sub-module loaded!")
global.registry.logger.log("templateBuilder sub-module loaded!")

var parserPlugIns = require('../templateBuilder/parserPlugIns.js');
var _cfg = global.conf

var builder = {
	'setup' : function() {
		_cfg.openTag = '{{'
		_cfg.closeTag = '}}'
	},

	'build' : function(templateName, data, onSuccessFunc) {
		fs = require('fs')
		fs.readFile(_cfg.paths.appRoot + _cfg.paths.templates + '/' + templateName, 'utf8', function (err,dataHTML) {
			if (err) {
				global.registry.logger.throw("Error reading file." + err)
			}
			var htmlText = concatenateTemplate(dataHTML, data);
			htmlText = executeForeachInTemplate(htmlText, data);
			htmlText = executeIfInTemplate(htmlText, data);
			data = {"data" : data}
			htmlText = parseTemplate(htmlText, data, '');
			onSuccessFunc(htmlText);
		});
	}
}

///////////////////////////////////////////////
// Helper methods
///////////////////////////////////////////////

function concatenateTemplate(dataHTML, data) {
	var parts = dataHTML.split(_cfg.openTag + "include ")
	var htmlText = ''
	for(var p in parts) {
	  if( p == 0) {
	      htmlText = parts[0]
	  }
	  else {
			// make sure that we split only once and preserve other plugIns
			var i = parts[p].indexOf(_cfg.closeTag);
			var parts2 = [parts[p].slice(0,i), parts[p].slice(i+2)];
			var fileLocation = parts2[0]
			// recursively add any other sub templates before addint html back
			htmlText += "\n<!-- ----======" + fileLocation + "=====---- -->\n" + concatenateTemplate(parserPlugIns['include'](parts2, data), data)
			htmlText += parts2[1]
		}
	}
	return htmlText;
}

/**
 *
 * Example:
 * {{foreach $$ data.users}}
 * 		username: {{$$ localdata.username}}
 * {{/foreach}}
 */
function executeForeachInTemplate(dataHTML, data) {
	var parts = dataHTML.split(_cfg.openTag + "foreach $$")
	var htmlText = ''
	for(var p in parts) {
	  if( p == 0) {
	      htmlText = parts[0]
	  }
	  else {
			// make sure that we split only once and preserve other plugIns
			var i = parts[p].indexOf(_cfg.closeTag);
			// extract foreach param, and the rest of the page
			var parts2 = [parts[p].slice(0,i), parts[p].slice(i+2)];
			// extract inner block and the rest of the html
			var blocksText = parts2[1].split(_cfg.openTag + "/foreach" + _cfg.closeTag);

			var localParams = eval(parts2[0]);
			for(var val in localParams) {
					var val = localParams[val];
					var localData = {"localdata" : val}
					htmlText += parseTemplate(blocksText[0], localData, '');
			}
			// adding the rest of the html
			htmlText += blocksText[1];
			//htmlText += parts2[1]
		}
	}
	return htmlText;
}

/**
 *
 * Example:
 * {{foreach $$ data.users}}
 * 		username: {{$$ localdata.username}}
 * {{/foreach}}
 */
function executeIfInTemplate(dataHTML, data) {
	var parts = dataHTML.split(_cfg.openTag + "if")
	var htmlText = ''
	for(var p in parts) {
	  if( p == 0) {
	      htmlText = parts[0]
	  }
	  else {
			// make sure that we split only once and preserve other plugIns
			var i = parts[p].indexOf(_cfg.closeTag);
			// extract foreach param, and the rest of the page
			var parts2 = [parts[p].slice(0,i), parts[p].slice(i+2)];
			// extract inner block and the rest of the html
			var blocksText = parts2[1].split(_cfg.openTag + "/if" + _cfg.closeTag);

			var evalResult = eval(parts2[0]);
			if(evalResult) {
				// if evaluated code is true, add the text in the block
				htmlText += blocksText[0];
			}

			// adding the rest of the html
			htmlText += blocksText[1];
		}
	}
	return htmlText;
}

function parseTemplate(dataHTML, data, pluginName) {
	var parts = dataHTML.split(_cfg.openTag + pluginName)
	var htmlText = ''

	for(var p in parts) {
	    if( p == 0) {
	        htmlText = parts[0]
	    }
	    else {
	        var parts2 = parts[p].split(_cfg.closeTag)
	        var operatorsString = parts2[0]
					// extract action and parameters
					params = operatorsString.split(' ')
					var action = params[0]
					params.shift()

					// execute all plug ins
					if(typeof parserPlugIns[action] == 'undefined') {
						global.registry.logger.log("Error. PlugIn " + action + " does not exist!", 4)
					}
					else {
						htmlText += parserPlugIns[action](params, data)
					}

	        htmlText += parts2[1]
	    }
	}
		//parts = htmlText.split(_cfg.openTag)
		//htmlText = ''

	return htmlText
}

/*
function parseOperators(operatorsString) {
	params = operatorsString.split(' ')
	var action = params[0]
	params.shift()
	var result = parserPlugIns[action](params)
	return result
}
*/

/*
function parseTemplate(dataHTML, data) {
	var parts = dataHTML.split(_cfg.openTag)
	var htmlText = ''


	for(var p in parts) {
	    if( p == 0) {
	        htmlText = parts[0]
	    }
	    else {
	        var parts2 = parts[p].split(_cfg.closeTag)
	        var operatorsString = parts2[0]
					htmlText += parseOperators(operatorsString)
	        htmlText += parts2[1]
	    }
	}
	return htmlText
}

function parseOperators(operatorsString) {
	params = operatorsString.split(' ')
	var action = params[0]
	params.shift()
	var result = parserPlugIns[action](params)
	return result
}
*/


module.exports = builder
