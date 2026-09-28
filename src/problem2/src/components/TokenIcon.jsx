import { tokenIconUrl } from '../../swap.js';

export function TokenIcon({ currency }) {
  return (
    <span className="token-icon" aria-hidden="true">
      {currency.slice(0, 1)}
      <img
        alt=""
        src={tokenIconUrl(currency)}
        onError={(event) => { event.currentTarget.hidden = true; }}
      />
    </span>
  );
}
