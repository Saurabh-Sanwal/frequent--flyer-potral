import { useRef, useState } from 'react';
import useMembers from '../hooks/useMembers';
import { sanitizeText } from '../utils/sanitize';
import { validateMember } from '../utils/validate';

export default function MemberForm() {
  const { addMember } = useMembers();
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);
  const refs = { name: useRef(null), email: useRef(null) };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: sanitizeText(value) }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateMember(form);
    setErrors(found);
    setServerError('');
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      refs[firstBad].current.focus();
      return;
    }
    setSaving(true);
    const result = await addMember({ name: form.name.trim(), email: form.email.trim() });
    setSaving(false);
    if (result.ok) setForm({ name: '', email: '' });
    else setServerError(result.error);
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate aria-labelledby="form-title">
      <h2 id="form-title">Enrol a member</h2>

      {['name', 'email'].map((field) => (
        <div className="field" key={field}>
          <label htmlFor={field}>{field === 'name' ? 'Full name' : 'Email address'}</label>
          <input
            ref={refs[field]}
            id={field}
            name={field}
            type={field === 'email' ? 'email' : 'text'}
            value={form[field]}
            onChange={handleChange}
            maxLength={60}
            autoComplete={field}
            aria-invalid={Boolean(errors[field])}
            aria-describedby={errors[field] ? `${field}-error` : undefined}
            className={errors[field] ? 'invalid' : ''}
          />
          {errors[field] && (
            <p id={`${field}-error`} className="error-text">
              {errors[field]}
            </p>
          )}
        </div>
      ))}

      {serverError && (
        <p className="error-text" role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" className="btn" disabled={saving}>
        {saving ? 'Enrolling…' : 'Enrol member'}
      </button>
    </form>
  );
}
