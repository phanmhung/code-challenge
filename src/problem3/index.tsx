import { useMemo } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

type WalletBalance = {
  currency: string;
  amount: number;
  blockchain: string;
};

type Props = ComponentPropsWithoutRef<'div'> & {
  balances: readonly WalletBalance[];
  prices: Readonly<Record<string, number | undefined>>;
};

// Keep priorities outside the component so they are not recreated on every render.
const priorities: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function priorityOf(blockchain: string) {
  return priorities[blockchain] ?? -1;
}

export default function WalletPage({ balances, prices, children, ...rest }: Props) {
  // Prices can change without needing to sort the balances again.
  const sortedBalances = useMemo(() =>
    balances
      // The original <= 0 check hid balances the user actually holds.
      .filter((balance) => priorityOf(balance.blockchain) > 0 && Number.isFinite(balance.amount) && balance.amount > 0)
      .sort((a, b) => priorityOf(b.blockchain) - priorityOf(a.blockchain)),
  [balances]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance) => {
        const price = prices[balance.currency];
        // A missing price should not become NaN on screen.
        const usdValue = price === undefined || !Number.isFinite(price) || price < 0
          ? null
          : balance.amount * price;

        return (
          // Position-based keys break when the priority order changes.
          <div key={`${balance.blockchain}-${balance.currency}`}>
            {balance.currency}: {balance.amount} —{' '}
            {usdValue === null || !Number.isFinite(usdValue)
              ? 'Price unavailable'
              : usdFormatter.format(usdValue)}
          </div>
        );
      })}
      {children}
    </div>
  );
}
