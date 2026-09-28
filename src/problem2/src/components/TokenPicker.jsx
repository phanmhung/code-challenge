import { useEffect, useRef, useState } from 'react';
import { formatAmount } from '../../swap.js';
import { TokenIcon } from './TokenIcon.jsx';

export function TokenPicker({ open, tokens, onClose, onSelect }) {
  const dialogRef = useRef(null);
  const searchRef = useRef(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    setSearch('');
    dialog.showModal();
    searchRef.current?.focus();
    return () => {
      dialog.close();
      trigger?.focus();
    };
  }, [open]);

  const matches = tokens.filter((token) => token.currency.toLowerCase().includes(search.trim().toLowerCase()));

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="token-dialog-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } }}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
    >
      <div className="dialog-heading">
        <h2 id="token-dialog-title">Select a token</h2>
        <button type="button" className="close-button" onClick={onClose} aria-label="Close token picker">×</button>
      </div>
      <label htmlFor="token-search" className="search-label">Search by symbol</label>
      <input
        ref={searchRef}
        id="token-search"
        type="search"
        placeholder="Search tokens"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div id="token-list" className="token-list">
        {matches.length === 0 && <p>No tokens found. Try another symbol.</p>}
        {matches.map((token) => (
          <button key={token.currency} type="button" className="token-option" aria-label={token.currency} onClick={() => onSelect(token)}>
            <TokenIcon currency={token.currency} />
            <span className="token-name">{token.currency}</span>
            <span className="token-price">${formatAmount(token.price)}</span>
          </button>
        ))}
      </div>
    </dialog>
  );
}
