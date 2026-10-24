import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

const script = readFileSync(
	new URL("../swiss-army-copy.user.js", import.meta.url),
	"utf8",
);

const AMAZON_URL =
	"https://www.amazon.co.jp/%E3%82%AD%E3%83%A3%E3%83%83%E3%83%81-ebook/dp/B01CQMK4BY/ref=sr_1_1?dib=abc&keywords=%E3%82%AD&qid=1792851492&sr=8-1";

// Loads the userscript into a fresh page so listeners never leak between tests.
const openPage = (url, body = '<p id="text">Hello</p>') => {
	const dom = new JSDOM(
		`<!doctype html><title>Page Title</title><body>${body}</body>`,
		{
			url,
			runScripts: "outside-only",
		},
	);
	const writeText = vi.fn(() => Promise.resolve());
	Object.defineProperty(dom.window.navigator, "clipboard", {
		value: { writeText },
	});
	dom.window.eval(script);
	return { window: dom.window, document: dom.window.document, writeText };
};

const press = (window, key, target = window.document.body) => {
	target.dispatchEvent(
		new window.KeyboardEvent("keydown", { key, ctrlKey: true, bubbles: true }),
	);
};

const select = (window, element) => {
	const range = window.document.createRange();
	range.selectNodeContents(element);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
};

describe("Ctrl+C", () => {
	it("copies the title and a shortened URL on an Amazon product page", () => {
		const { window, writeText } = openPage(AMAZON_URL);
		press(window, "c");
		expect(writeText).toHaveBeenCalledExactlyOnceWith(
			"Page Title\nhttps://www.amazon.co.jp/dp/B01CQMK4BY",
		);
	});

	it("copies the title and the URL as is on other pages", () => {
		const { window, writeText } = openPage("https://example.com/path?q=1");
		press(window, "c");
		expect(writeText).toHaveBeenCalledExactlyOnceWith(
			"Page Title\nhttps://example.com/path?q=1",
		);
	});

	it("leaves selected text to the browser", () => {
		const { window, document, writeText } = openPage("https://example.com/");
		select(window, document.getElementById("text"));
		press(window, "c");
		expect(writeText).not.toHaveBeenCalled();
	});

	it("leaves text in an input to the browser", () => {
		const { window, document, writeText } = openPage(
			"https://example.com/",
			'<input id="search" value="bbb">',
		);
		const input = document.getElementById("search");
		input.focus();
		input.select();
		press(window, "c", input);
		expect(writeText).not.toHaveBeenCalled();
	});
});

describe("Ctrl+M", () => {
	it("copies a Markdown link to the page", () => {
		const { window, writeText } = openPage("https://example.com/");
		press(window, "m");
		expect(writeText).toHaveBeenCalledExactlyOnceWith(
			"[Page Title](https://example.com/)",
		);
	});
});

describe("Ctrl+Q", () => {
	it("copies the selected lines as a Markdown quote", () => {
		const { window, document, writeText } = openPage(
			"https://example.com/",
			'<pre id="text">first\nsecond</pre>',
		);
		select(window, document.getElementById("text"));
		press(window, "q");
		expect(writeText).toHaveBeenCalledExactlyOnceWith("> first\n> second");
	});

	it("does nothing without a selection", () => {
		const { window, writeText } = openPage("https://example.com/");
		press(window, "q");
		expect(writeText).not.toHaveBeenCalled();
	});
});
