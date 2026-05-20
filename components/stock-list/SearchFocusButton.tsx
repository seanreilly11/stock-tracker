'use client'

const SearchFocusButton = () => (
  <button
    onClick={() => document.getElementById('stock-search-input')?.focus()}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-[family-name:var(--sans)] text-[12.5px] font-medium hover:opacity-80 transition-opacity"
  >
    + Add your first ticker
  </button>
)

export default SearchFocusButton
