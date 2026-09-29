import { useCallback, useMemo, useRef, useState } from 'react';
import { MemberContext } from './MemberContext';
import { api } from '../api/client';
import { track } from '../utils/analytics';

export default function MemberProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const latest = useRef(0); // ignores stale responses from older searches

  const loadMembers = useCallback(async (search = '') => {
    const id = ++latest.current;
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/members?q=${encodeURIComponent(search)}`);
      if (id === latest.current) setMembers(data);
    } catch (err) {
      if (id === latest.current) setError(err.message);
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, []);

  const run = useCallback(async (fn, action) => {
    try {
      await fn();
      track(action);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  const addMember = useCallback(
    (form) =>
      run(async () => {
        const member = await api.post('/members', form);
        setMembers((prev) => [member, ...prev]);
      }, 'Member enrolled'),
    [run]
  );

  const addMiles = useCallback(
    (id, miles) =>
      run(async () => {
        const updated = await api.patch(`/members/${id}/miles`, { miles });
        setMembers((prev) => prev.map((m) => (m._id === id ? updated : m)));
      }, 'Miles added'),
    [run]
  );

  const removeMember = useCallback(
    (id) =>
      run(async () => {
        await api.delete(`/members/${id}`);
        setMembers((prev) => prev.filter((m) => m._id !== id));
      }, 'Member removed'),
    [run]
  );

  const value = useMemo(
    () => ({ members, loading, error, loadMembers, addMember, addMiles, removeMember }),
    [members, loading, error, loadMembers, addMember, addMiles, removeMember]
  );

  return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
}
