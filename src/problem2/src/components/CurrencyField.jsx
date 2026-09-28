import { TokenIcon } from './TokenIcon.jsx';
import { ChevronDownIcon } from './Icons.jsx';

export function CurrencyField({ side, label, amount, token, usdValue, onAmountChange, onSelectToken, disabled, readOnly = false, error }) {
  const inputId = side === 'from' ? 'input-amount' : 'output-amount';

  return (
    <section className="currency-field">
      <label htmlFor={inputId}>{label}</label>
      <div className="field-row">
        <input
          id={inputId}
          type="text"
          inputMode={readOnly ? undefined : 'decimal'}
          autoComplete="off"
          placeholder="0.00"
          maxLength={80}
          value={amount}
          onChange={readOnly ? undefined : (event) => onAmountChange(event.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          aria-invalid={side === 'from' ? Boolean(error) : undefined}
          aria-describedby={side === 'from' ? 'amount-error' : undefined}
        />
        <button
          id={`${side}-token`}
          type="button"
          className="token-button"
          onClick={() => onSelectToken(side)}
          disabled={disabled || !token}
          aria-haspopup="dialog"
          aria-label={`Choose token to ${side === 'from' ? 'send' : 'receive'}: ${token?.currency ?? 'none'}`}
        >
          {token && <TokenIcon currency={token.currency} />}
          <span>{token?.currency ?? 'Select'}</span>
          <ChevronDownIcon className="chevron" />
        </button>
      </div>
      <p className="usd-value">{usdValue}</p>
    </section>
  );
}
