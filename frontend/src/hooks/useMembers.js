import { useContext } from 'react';
import { MemberContext } from '../context/MemberContext';

export default function useMembers() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMembers must be used inside <MemberProvider>');
  return ctx;
}
