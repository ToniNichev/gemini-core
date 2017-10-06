var _cfg = global.conf


module.exports =  {

	include : function(params, data) {
		var templateName = params[0]
		fs = require('fs')
		var result = fs.readFileSync(_cfg.paths.appRoot +  '/' + _cfg.paths.templates + '/' + templateName, 'utf8')
		return result
	},

	printTest: function(params, data) {
		return "THIS IS PLUGIN TEST:" + params[0]
	},

	/**
	 * Returns selected config parameter
	 * example {{getConfig mainConfig.app.base_url}}
	 */
	getConfig: function(params, data) {
		return eval('_cfg.' + params[0])
	},

	printConfig: function(params, data) {
		if(params.length > 0) {
			return JSON.stringify(eval('_cfg.' + params[0]))
		}
		else {
			return JSON.stringify(_cfg)
		}
	},

	/**
	 *
	 */
	printDataObject : function(params, data) {
		return JSON.stringify(data.data)
	},


	$$: function(params, data) {
		try {
			var result = eval('data.' + params[0]);
			//var result = eval(params[0]);
			return result;
		}
		catch(e){
			global.registry.logger.log("[gemini\/templateBuilder\/parserPlugIns.js]\nMissing parameter `" + params[0] + "`", 4);
			return ''
		}
	}
}
