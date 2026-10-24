# Swiss Army Copy

## Install

1. Install [Violentmonkey](https://violentmonkey.github.io/)
2. Click [Swiss Army Copy](https://github.com/oooooooo/swiss-army-copy/raw/main/swiss-army-copy.user.js)

## Usage

### C-c

If no text is selected, the tool copies the title and URL.

In the case of Amazon, the URL is shortened.

```text
https://www.amazon.com/Victorinox-Swiss-Classic-Pocket-Knife/dp/B00004YVB2?ref_=ast_sto_dp&th=1
```

↓ Paste

```text
https://www.amazon.com/dp/B00004YVB2
```

### C-m

Create links in markdown format

```text
[title](url)
```

### C-q

Create quote in markdown format

```text
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```

↓ Paste

```text
> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
>
> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
>
> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
