# Swiss Army Copy

## Install

1. Install [Violentmonkey](https://violentmonkey.github.io/)
2. Click [Swiss Army Copy](https://github.com/oooooooo/swiss-army-copy/raw/main/swiss-army-copy.user.js)

## Usage

### C-c

If no text is selected, the tool copies the title and URL.

The URL is cleaned: tracking parameters such as `utm_*` and `fbclid` are
removed, and Amazon product URLs are shortened.

```text
https://www.amazon.com/Victorinox-Swiss-Classic-Pocket-Knife/dp/B00004YVB2?ref_=ast_sto_dp&th=1
```

↓ Paste

```text
https://www.amazon.com/dp/B00004YVB2
```

### C-m

Create links in markdown format with the cleaned URL

```text
[title](url)
```

### C-q

Create quote in markdown format

```text
Lorem ipsum dolor sit amet.

Ut enim ad minim veniam.
```

↓ Paste

```text
> Lorem ipsum dolor sit amet.
>
> Ut enim ad minim veniam.
```

## Development

```sh
pnpm install
pnpm test
pnpm lint
```

## Related

- [Auto Copy](https://chrome.google.com/webstore/detail/auto-copy/bijpdibkloghppkbmhcklkogpjaenfkg)

## License

MIT
