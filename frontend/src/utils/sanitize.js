// Strips characters used for XSS before text ever reaches state.
export const sanitizeText = (value) =>
  String(value).replace(/[<>]/g, '').replace(/javascript:/gi, '').trimStart();
