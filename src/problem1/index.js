function validate(n) {
  if (!Number.isSafeInteger(n) || n > 134217727) {
    throw new RangeError('Use a safe integer whose sum fits in Number.MAX_SAFE_INTEGER.');
  }
}

function sum_to_n_a(n) {
  validate(n);
  let total = 0;
  for (let i = 1; i <= n; i += 1) total += i;
  return total;
}

function sum_to_n_b(n) {
  validate(n);
  if (n <= 0) return 0;
  return n % 2 === 0 ? (n / 2) * (n + 1) : n * ((n + 1) / 2);
}

function sum_to_n_c(n) {
  validate(n);
  function sumRange(start, end) {
    if (start > end) return 0;
    if (start === end) return start;
    const middle = Math.floor((start + end) / 2);
    return sumRange(start, middle) + sumRange(middle + 1, end);
  }
  return sumRange(1, n);
}

module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
