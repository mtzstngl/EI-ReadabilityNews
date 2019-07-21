"use strict";

/**
 * Zeigt die readability-Version eines Artikels an.
 * -> Verwendet die mozilla/readability Bibliothek.
 * Benötigt das Modul MMM-News-QR um zu funktionieren.
 * Wartet auf die "ARTICLE_INFO_RESPONSE" Benachrichtigung und leitet es an node_helper.js weiter.
 * node_helper.js ruft den Artikel ab und sendet das Ergebnis zurück ("ARTICLE" Benachrichtigung).
 * -> Zeigt das Ergebnis an.
 */
Module.register("EI-ReadabilityNews",{

	defaults: {
	},

	article: "",

	start: function() {
		const self = this;

		// We need to send a notification to the node_helper in order to establish the socket connection
		// After this the node_helper can send notifications to the module
		self.sendSocketNotification("START");
	},

	getDom: function () {
		const self = this;

		var wrapper = document.createElement("div");
		wrapper.innerHTML = self.article.content;
		wrapper.className = "msmall align-left";
		wrapper.style = "width:1640px; height:850px; word-wrap:break-word;";

		return wrapper;
	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === "ARTICLE_INFO_RESPONSE") {
		  this.sendSocketNotification(notification, payload);
		}
	},

	// Is called if we receive a notification from our node_helper.js
	socketNotificationReceived: function(notification, payload) {
		const self = this;

		//Log.log(this.name + " received a socket notification: " + notification + " - Payload: " + payload);
		switch (notification) {
		case "ARTICLE": // Got new output from the python module about the current hand position.
			self.article = payload;
			self.updateDom();
			break;
		}
	},
});
