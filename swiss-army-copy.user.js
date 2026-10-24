// ==UserScript==
// @name        Swiss Army Copy
// @namespace   Violentmonkey Scripts
// @description Formats copy output in multiple formats
// @match       *://*/*
// @version     0.9.4
// @author      oooooooo
// @updateURL   https://github.com/oooooooo/swiss-army-copy/raw/main/swiss-army-copy.user.js
// @downloadURL https://github.com/oooooooo/swiss-army-copy/raw/main/swiss-army-copy.user.js
// @supportURL  https://github.com/oooooooo/swiss-army-copy/
// ==/UserScript==

(() => {
	// biome-ignore lint/suspicious/noRedundantUseStrict: userscripts run as classic scripts, not modules.
	"use strict";

	const amazonUrl =
		/(?<url>https?:\/\/(www\.)?amazon\.(.+?))\/(.+?)?dp\/(?<asin>[a-zA-Z0-9]+)/;

	const isEditable = (element) =>
		element instanceof HTMLInputElement ||
		element instanceof HTMLTextAreaElement ||
		(element instanceof HTMLElement && element.isContentEditable);

	// Handle Ctrl+C on keydown instead of the copy event: Chrome does not fire
	// copy when nothing is selected.
	window.addEventListener(
		"keydown",
		(event) => {
			if (!event.ctrlKey || event.key.toLowerCase() !== "c") return;
			if (window.getSelection().toString() !== "") return;
			// Text selected inside an input is invisible to getSelection(), so leave it to the browser.
			if (isEditable(document.activeElement)) return;

			let url = document.location.href;

			const match = amazonUrl.exec(url);
			if (match) {
				url = `${match.groups.url}/dp/${match.groups.asin}`;
			}

			navigator.clipboard.writeText(`${document.title}\n${url}`);
		},
		true,
	);

	document.addEventListener("keydown", (event) => {
		if (event.ctrlKey && event.key === "m") {
			navigator.clipboard.writeText(
				`[${document.title}](${document.location.href})`,
			);
		}

		if (event.ctrlKey && event.key === "q") {
			const text = window.getSelection().toString();
			if (text !== "") {
				navigator.clipboard.writeText(
					text
						.split("\n")
						.map((line) => `> ${line}`)
						.join("\n"),
				);
			}
		}
	});
})();
