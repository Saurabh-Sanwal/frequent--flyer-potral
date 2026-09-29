const clean = (value) =>
  typeof value === 'string' ? value.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim() : value;

export const sanitizeBody = (req, _res, next) => {
  for (const key of Object.keys(req.body || {})) req.body[key] = clean(req.body[key]);
  next();
};
