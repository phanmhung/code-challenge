# Three ways to sum to n

Run `node --test src/problem1/index.test.js` from the repository root. No dependencies are needed.

Each function sums the integers from 1 through n. I treat n <= 0 as an empty range, returning 0. Fractional, nonnumeric, unsafe, and excessively large inputs throw a RangeError. The largest supported positive n is 134,217,727.

| Function | Approach | Time | Extra space |
| --- | --- | --- | --- |
| sum_to_n_a | Accumulate in a loop | O(n) | O(1) |
| sum_to_n_b | Arithmetic series formula | O(1) | O(1) |
| sum_to_n_c | Recursively split the range | O(n) | O(log n) |

The formula is the practical choice. It divides the even factor before multiplication to keep intermediate results within the safe integer range. The recursive version demonstrates a different approach without a linear-depth call stack; it still does more work than the loop.
