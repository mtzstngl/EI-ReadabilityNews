var NodeHelper = require("node_helper");
var JSDOM = require("jsdom").JSDOM;
var Readability = require("readability");

/**
 * Erhält mittels "ARTICLE_INFO_RESPONSE" Benachrichtigung den aktuellen Artikel.
 * Ruft den Artikel mittels jsdom ab und verwendet readability, um ihn leichter lesbar zu machen.
 * Sendet das Ergebnis zurück an EI-ReadabilityNews.js
 */
module.exports = NodeHelper.create({

	// System is ready to boot
	start: function() {
		console.log("EI-ReadabilityNews node_helper started");
	},

	updateArticle: function(payload) {
		const self = this;

		// NOTE (MSt): Some websites need javascript to function properly (tagesschau.de currently does not).
		// If javascript is needed, pass the following option
		// { runScripts: "dangerously" }
		JSDOM.fromURL(payload.url).then(dom => {
			let reader = new Readability(dom.window.document);
			let article = reader.parse();
			//console.log(article);

			self.sendSocketNotification("ARTICLE", article);
		});
	},

	// System is shutting down
	stop: function() {
		console.log("EI-ReadabilityNews node_helper stopped");
	},

	// My module (EI-ReadabilityNews.js) has sent a notification
	socketNotificationReceived: function(notification, payload) {
		const self = this;

		//console.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		if (notification === "ARTICLE_INFO_RESPONSE") {
			self.updateArticle(payload);
		}
	},
});