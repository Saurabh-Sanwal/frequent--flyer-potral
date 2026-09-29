const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateMember = ({ name, email }) => {
  const errors = {};
  if (name.trim().length < 2) errors.name = 'Enter a name with at least 2 characters.';
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email, like name@example.com.';
  return errors;
};

export const validateMiles = (value) => {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 100000) return 'Enter miles between 1 and 100,000.';
  return '';
};
