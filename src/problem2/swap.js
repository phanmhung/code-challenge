export const PRICES_URL = 'https://interview.switcheo.com/prices.json';

export function normalizePrices(data) {
  if (!Array.isArray(data)) throw new Error('Invalid price data.');
  const tokens = new Map();
  for (const row of data) {
    if (!row || typeof row.currency !== 'string' || !row.currency.trim() ||
        !Number.isFinite(row.price) || row.price <= 0) continue;
    const date = Date.parse(row.date);
    const timestamp = Number.isFinite(date) ? date : 0;
    const previous = tokens.get(row.currency);
    if (!previous || timestamp >= previous.timestamp) {
      tokens.set(row.currency, { currency: row.currency, price: row.price, timestamp });
    }
  }
  return [...tokens.values()].sort((a, b) => a.currency.localeCompare(b.currency));
}

export function quote(amount, fromPrice, toPrice) {
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(amount)) return null;
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0 || !Number.isFinite(fromPrice) ||
      !Number.isFinite(toPrice) || fromPrice <= 0 || toPrice <= 0) return null;
  const result = value * (fromPrice / toPrice);
  return Number.isFinite(result) && result > 0 ? result : null;
}

export function formatAmount(value) {
  if (!Number.isFinite(value)) return '—';
  if (value > 0 && (value < 0.000001 || value >= 1e12)) return value.toExponential(4);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
}

const iconNames = {
  STEVMOS: 'stEVMOS',
  RATOM: 'rATOM',
  STOSMO: 'stOSMO',
  STATOM: 'stATOM',
  STLUNA: 'stLUNA',
};

export function tokenIconUrl(currency) {
  const filename = iconNames[currency] ?? currency;
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${encodeURIComponent(filename)}.svg`;
}
