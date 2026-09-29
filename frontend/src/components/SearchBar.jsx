import { sanitizeText } from '../utils/sanitize';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="search">Search members</label>
      <input
        id="search"
        type="search"
        value={value}
        placeholder="Name, email or member ID"
        onChange={(e) => onChange(sanitizeText(e.target.value))}
        maxLength={50}
      />
    </div>
  );
}
