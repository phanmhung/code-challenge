import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePrices, quote, tokenIconUrl } from './swap.js';

test('keeps the newest valid price per currency and sorts the list', () => {
  const result = normalizePrices([
    { currency: 'ETH', price: 2000, date: '2023-08-30' },
    { currency: 'ETH', price: 1000, date: '2023-08-29' },
    { currency: 'BTC', price: 30000, date: '2023-08-30' },
    { currency: 'ETH', price: -1, date: '2023-08-31' },
    null, { currency: 'BAD', price: Infinity }, { currency: 'ZERO', price: 0 },
  ]);
  assert.deepEqual(result.map(({ currency, price }) => [currency, price]), [['BTC', 30000], ['ETH', 2000]]);
});
test('rejects malformed feeds', () => {
  assert.throws(() => normalizePrices({}), /price/i);
});
test('converts amounts using the currency price ratio', () => {
  assert.equal(quote('2.5', 2000, 1), 5000);
  assert.equal(quote('.5', 1, 2000), .00025);
});
test('rejects invalid amounts, invalid prices, overflow and underflow', () => {
  for (const amount of ['', '0', '-1', '1abc', '1e3', 'Infinity', '.', '1,000']) {
    assert.equal(quote(amount, 2000, 1), null);
  }
  assert.equal(quote('1', 1, 0), null);
  assert.equal(quote('1', -1, 1), null);
  assert.equal(quote('9'.repeat(310), 2000, 1), null);
  assert.equal(quote('1', Number.MIN_VALUE, Number.MAX_VALUE), null);
});

test('uses the exact icon filenames for mixed-case staking tokens', () => {
  for (const [currency, filename] of [
    ['STEVMOS', 'stEVMOS'],
    ['RATOM', 'rATOM'],
    ['STOSMO', 'stOSMO'],
    ['STATOM', 'stATOM'],
    ['STLUNA', 'stLUNA'],
    ['ETH', 'ETH'],
  ]) {
    assert.equal(tokenIconUrl(currency), `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${filename}.svg`);
  }
});
