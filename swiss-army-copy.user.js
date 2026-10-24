// ==UserScript==
// @name        Swiss Army Copy
// @namespace   Violentmonkey Scripts
// @description Formats copy output in multiple formats
// @match       *://*/*
// @version     0.10.0
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

	// Only parameters that are always tracking; e.g. "ref" is left alone because
	// sites such as GitHub use it for real content.
	const trackingParam =
		/^(utm_.+|fbclid|gclid|dclid|gbraid|wbraid|msclkid|yclid|igshid|mc_cid|mc_eid)$/;

	// Filter the raw query string instead of URLSearchParams so the remaining
	// parameters keep their original spelling (e.g. "?flag" stays "?flag").
	const removeTrackingParams = (href) => {
		const url = new URL(href);
		const params = url.search
			.slice(1)
			.split("&")
			.filter(
				(param) => param !== "" && !trackingParam.test(param.split("=")[0]),
			);
		url.search = params.join("&");
		return url.href;
	};

	const cleanUrl = (href) => {
		const match = amazonUrl.exec(href);
		if (match) {
			return `${match.groups.url}/dp/${match.groups.asin}`;
		}
		return removeTrackingParams(href);
	};

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

			navigator.clipboard.writeText(
				`${document.title}\n${cleanUrl(document.location.href)}`,
			);
		},
		true,
	);

	document.addEventListener("keydown", (event) => {
		if (event.ctrlKey && event.key === "m") {
			navigator.clipboard.writeText(
				`[${document.title}](${cleanUrl(document.location.href)})`,
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
