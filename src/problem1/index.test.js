const { test } = require('node:test');
const assert = require('node:assert/strict');
const sums = require('./index.js');

for (const [name, sum] of Object.entries(sums)) {
  test(`${name}: sums positive integers and handles empty ranges`, () => {
    for (const [n, expected] of [[-5, 0], [0, 0], [1, 1], [5, 15], [100, 5050], [10000, 50005000]]) {
      assert.equal(sum(n), expected);
    }
  });
  test(`${name}: rejects unsupported inputs`, () => {
    for (const n of [1.5, NaN, Infinity, '5', 134217728]) {
      assert.throws(() => sum(n), RangeError);
    }
  });
}
test('formula preserves precision near the safe integer boundary', () => {
  assert.equal(sums.sum_to_n_b(134217727), 9007199187632128);
});
