import { useState } from 'react';
import useMembers from '../hooks/useMembers';
import { validateMiles } from '../utils/validate';

function MemberCard({ member }) {
  const { addMiles, removeMember } = useMembers();
  const [miles, setMiles] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const inputId = `miles-${member._id}`;

  const handleAdd = async (e) => {
    e.preventDefault();
    const problem = validateMiles(miles);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setBusy(true);
    const result = await addMiles(member._id, Number(miles));
    setBusy(false);
    if (result.ok) setMiles('');
    else setError(result.error);
  };

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${member.name}? This cannot be undone.`)) return;
    setBusy(true);
    const result = await removeMember(member._id);
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
    }
  };

  return (
    <li className="card member">
      <div className="member-top">
        <div>
          <h3>{member.name}</h3>
          <p className="muted">{member.email}</p>
          <p className="muted">ID {member.memberId}</p>
        </div>
        <span className={`badge badge-${member.tier.toLowerCase()}`}>{member.tier}</span>
      </div>

      <p className="miles">
        {member.points.toLocaleString()} <span>miles</span>
      </p>

      <form className="miles-form" onSubmit={handleAdd} noValidate>
        <label htmlFor={inputId}>Add miles for {member.name}</label>
        <div className="row">
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            min="1"
            value={miles}
            onChange={(e) => {
              setMiles(e.target.value);
              setError('');
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={error ? 'invalid' : ''}
          />
          <button type="submit" className="btn" disabled={busy}>
            {busy ? 'Saving…' : 'Add miles'}
          </button>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="error-text" role="alert">
            {error}
          </p>
        )}
      </form>

      <button
        type="button"
        className="btn btn-ghost"
        onClick={handleRemove}
        disabled={busy}
        aria-label={`Remove ${member.name}`}
      >
        Remove member
      </button>
    </li>
  );
}

export default function MemberList({ members }) {
  return (
    <ul className="member-grid">
      {members.map((m) => (
        <MemberCard key={m._id} member={m} />
      ))}
    </ul>
  );
}
