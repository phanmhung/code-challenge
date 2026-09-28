import { useEffect, useState } from 'react';
import { PRICES_URL, normalizePrices, quote, formatAmount } from '../swap.js';
import { CurrencyField } from './components/CurrencyField.jsx';
import { TokenPicker } from './components/TokenPicker.jsx';
import { HorizontalSwapIcon, VerticalSwapIcon } from './components/Icons.jsx';

export function App() {
  const [tokens, setTokens] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [amount, setAmount] = useState('1');
  const [pickerSide, setPickerSide] = useState(null);
  const [loadState, setLoadState] = useState('loading');
  const [swapping, setSwapping] = useState(false);
  const [message, setMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    async function loadPrices() {
      setLoadState('loading');
      try {
        const response = await fetch(PRICES_URL, { signal: controller.signal });
        if (!response.ok) throw new Error('Price request failed');
        const nextTokens = normalizePrices(await response.json());
        if (nextTokens.length < 2) throw new Error('Not enough tokens');
        if (controller.signal.aborted) return;
        const first = nextTokens.find((token) => token.currency === 'ETH') ?? nextTokens[0];
        const second = nextTokens.find((token) => token.currency === 'USDC' && token !== first)
          ?? nextTokens.find((token) => token !== first);
        setTokens(nextTokens);
        setFrom(first);
        setTo(second);
        setLoadState('ready');
      } catch {
        if (!controller.signal.aborted) setLoadState('error');
      } finally {
        clearTimeout(timeout);
      }
    }

    loadPrices();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [reloadKey]);

  const receive = quote(amount.trim(), from?.price, to?.price);
  const amountError = amount.trim() && receive === null
    ? 'Enter a positive amount, using digits and a decimal point.'
    : '';
  const canSubmit = loadState === 'ready' && receive !== null && !swapping && from?.currency !== to?.currency;
  const referenceDate = from && to ? Math.min(from.timestamp, to.timestamp) : 0;
  const formattedDate = referenceDate
    ? new Date(referenceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : null;

  function handleSelectToken(token) {
    if (pickerSide === 'from') {
      if (token.currency === to.currency) setTo(from);
      setFrom(token);
    } else {
      if (token.currency === from.currency) setFrom(to);
      setTo(token);
    }
    setMessage('');
    setPickerSide(null);
  }

  function reversePair() {
    setFrom(to);
    setTo(from);
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    const confirmation = `Demo complete: ${formatAmount(Number(amount))} ${from.currency} → ${formatAmount(receive)} ${to.currency}. No funds were moved.`;
    setSwapping(true);
    setMessage('');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSwapping(false);
    setMessage(confirmation);
  }

  const disabled = loadState !== 'ready' || swapping;
  const sendUsd = receive === null ? '—' : `≈ $${formatAmount(Number(amount) * from.price)} USD`;
  const receiveUsd = receive === null ? '—' : `≈ $${formatAmount(receive * to.price)} USD`;

  return (
    <main className="page">
      <div className="swap-card">
        <div className="card-heading">
          <div>
            <h1>Swap</h1>
            <p>Choose two tokens to see the exchange rate.</p>
          </div>
          <span className="heading-icon"><HorizontalSwapIcon /></span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <CurrencyField
            side="from"
            label="You send"
            amount={amount}
            token={from}
            usdValue={sendUsd}
            onAmountChange={(value) => { setAmount(value); setMessage(''); }}
            onSelectToken={setPickerSide}
            disabled={disabled}
            error={amountError}
          />
          <div className="reverse-wrap">
            <button type="button" id="flip" aria-label="Reverse swap direction" onClick={reversePair} disabled={disabled}><VerticalSwapIcon /></button>
          </div>
          <CurrencyField
            side="to"
            label="You receive"
            amount={receive === null ? '' : formatAmount(receive)}
            token={to}
            usdValue={receiveUsd}
            onSelectToken={setPickerSide}
            disabled={disabled}
            readOnly
          />
          <p id="amount-error" className="error" aria-live="polite">{amountError}</p>
          <div className="rate-row">
            <span>Rate</span>
            <strong id="rate">{from && to ? `1 ${from.currency} ≈ ${formatAmount(from.price / to.price)} ${to.currency}` : '—'}</strong>
          </div>
          <button id="confirm" className="confirm-button" type="submit" disabled={!canSubmit}>
            {swapping ? 'Swapping…' : receive === null ? 'Enter an amount' : 'Confirm swap'}
          </button>
        </form>

        {loadState === 'loading' && <p id="load-state" className="status" role="status">Loading token prices…</p>}
        {loadState === 'error' && (
          <div className="load-error">
            <p id="load-state" role="alert">We couldn’t load token prices. Please try again.</p>
            <button id="retry" type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
          </div>
        )}
        {loadState === 'ready' && <p id="load-state" className="status">Reference prices{formattedDate ? ` · ${formattedDate}` : ''}. Not a live quote.</p>}
        {message && <p id="swap-status" className="success" role="status">{message}</p>}
        <p className="footnote">Demo only. No wallet or real funds are used.</p>
      </div>
      <TokenPicker open={pickerSide !== null} tokens={tokens} onClose={() => setPickerSide(null)} onSelect={handleSelectToken} />
    </main>
  );
}
