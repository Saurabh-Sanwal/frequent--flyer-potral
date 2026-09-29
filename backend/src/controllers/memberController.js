import Member from '../models/Member.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const httpError = (status, message) => Object.assign(new Error(message), { status });
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getMembers = async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 50);
  const filter = {};
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { memberId: rx }];
  }
  res.json(await Member.find(filter).sort({ createdAt: -1 }).limit(100));
};

export const createMember = async (req, res) => {
  const { name, email } = req.body;
  if (!name || name.length < 2) throw httpError(400, 'Name must be at least 2 characters');
  if (!email || !EMAIL_RE.test(email)) throw httpError(400, 'Enter a valid email address');
  res.status(201).json(await Member.create({ name, email }));
};

export const addMiles = async (req, res) => {
  const miles = Number(req.body.miles);
  if (!Number.isInteger(miles) || miles < 1 || miles > 100000) {
    throw httpError(400, 'Miles must be a whole number between 1 and 100,000');
  }
  const member = await Member.findByIdAndUpdate(
    req.params.id,
    { $inc: { points: miles } },
    { new: true }
  );
  if (!member) throw httpError(404, 'Member not found');
  res.json(member);
};

export const deleteMember = async (req, res) => {
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) throw httpError(404, 'Member not found');
  res.json({ message: 'Member removed' });
};
