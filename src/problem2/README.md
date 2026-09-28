# Fancy Form

A small React swap form built with Vite. It follows the challenge's simple card layout with a light blue palette. The app uses `App.jsx` for price loading and swap state, `CurrencyField.jsx` for the two amount fields, and `TokenPicker.jsx` for token search. `swap.js` contains the price and conversion functions so they can be tested without a browser.

## Run

Requires Node.js 22.12+ (or a supported newer release).

```sh
cd src/problem2
npm ci
npm run dev
```

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser tests use fixed prices, so they do not depend on the external service.

## Behavior and assumptions

- Prices come from the Switcheo endpoint in the challenge. Invalid and nonpositive prices are omitted. When a currency appears more than once, the newest valid dated price is used.
- The estimate is `amount × send price ÷ receive price`. The form accepts positive decimal amounts. It displays up to six decimal places, or scientific notation for very small or large results. This demo uses JavaScript numbers rather than settlement-grade decimal arithmetic.
- The feed is reference data. The date shown is the older timestamp of the selected pair; the estimate is not presented as a live quote.
- Reversing the pair keeps the entered amount. Choosing the token on the other side exchanges the selections, so the same token cannot appear on both sides.
- Confirmation simulates a one-second request. Controls are disabled while it runs. No wallet is connected and no funds move.
- The form offers a retry for failed, timed-out, malformed, or insufficient price responses. A token's first letter appears when its icon cannot load.
- The picker supports search, keyboard use, Escape to close, and focus restoration. Form errors and completion status are announced to assistive technology.

The [HungTran512 reference](https://github.com/HungTran512/code-challenge/tree/main/src/problem2) informed the form's overall structure. The code and blue styling here are original. Token icons come from the repository linked in the challenge.
