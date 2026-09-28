# Problem 3: Messy React

I assumed the page should show positive balances on supported blockchains. The original code checks `amount <= 0`, which seems backwards for a wallet. If zero or negative amounts matter to the product, I would confirm that rule before changing it.

## What is wrong

- `lhsPriority` is not defined. The filter calculates `balancePriority` but then reads a different name.
- `WalletBalance` is missing `blockchain`, although the code uses it. `getPriority` also takes `any` where a string would do.
- The filter keeps nonpositive amounts. I changed it to keep positive balances on known chains.
- `formattedBalances` is calculated and then ignored. The next map reads `formatted` from items that do not have it. `toFixed()` with no precision also rounds away fractional token amounts.
- `prices` is in the sorting memo's dependencies, even though sorting does not use prices. Price updates should not repeat that work.
- The comparator has no explicit return for equal priorities. Returning the difference handles that case. A priority lookup happens during sorting, but it is a cheap table lookup; I would only cache it per item if profiling showed this list was large enough to matter.
- Index keys can point React at the wrong row after sorting. The example uses blockchain and currency together, assuming there is at most one balance for each pair. A real wallet with multiple accounts needs a unique balance ID instead.
- A missing price produces `NaN`. The refactor shows “Price unavailable” rather than treating an unknown value as zero.
- The component drops `children`. The refactor renders them. The original snippet also refers to `BoxProps`, hooks, `WalletRow`, and styling that were not supplied, so this example takes balances and prices as props.

`filter(...).sort(...)` does not change the source array: `filter()` returns a new array. The refactor keeps `useMemo` on `balances` only. Filtering takes O(n) time and sorting the visible items takes O(k log k) time. The result is an array of up to k items.
