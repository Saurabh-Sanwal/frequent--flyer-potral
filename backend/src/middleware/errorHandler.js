export const notFound = (req, res) =>
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let status = err.status || 500;
  let message = err.message;

  if (err.code === 11000) {
    status = 409;
    message = 'A member with this email already exists';
  } else if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid member id';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  if (status === 500) {
    console.error(err);
    message = 'Server error. Please try again.';
  }
  res.status(status).json({ message });
};
