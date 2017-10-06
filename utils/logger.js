'use strict';

var colors = {
	Reset : "\x1b[0m",
	FgBlue : "\x1b[34m",
	FgYellow : "\x1b[33m",
	FgRed : "\x1b[31m",
	FgWhite : "\x1b[37m",

	BgBlack : "\x1b[40m",
	BgRed : "\x1b[41m",
	BgGreen : "\x1b[42m",
	BgYellow : "\x1b[43m",
	BgBlue : "\x1b[44m",
	BgMagenta : "\x1b[45m",
	BgCyan : "\x1b[46m",
	BgWhite : "\x1b[47m",
}

module.exports = {

	log : function(msg, type) {
			var header_devider = "#######################################################################"
			var date = '[' + new Date() + ']'
			var msgType = ""
			switch(type) {
				case 1:
					msgType = colors.FgWhite + "Log: "
					break;
				case 2:
					msgType = colors.FgYellow + " Info: "
					break;
				case 3:
					msgType = colors.FgBlue + colors.BgYellow + " Warning: "
					break;
				case 4:
					msgType = colors.FgWhite + colors.BgRed + " Error: "
					break;
				default:
					msgType = " "
				break;
			}
			console.log(header_devider)
			console.log(date + "\n" + msgType)
			console.log(msg)
			console.log(colors.Reset, header_devider)
	},

	throw: function(msg) {
		this.log(msg, 4)
		throw ""
	}
}
