import { useEffect, useMemo, useState } from 'react';
import useMembers from './hooks/useMembers';
import useDebounce from './hooks/useDebounce';
import MemberForm from './components/MemberForm';
import MemberList from './components/MemberList';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import EmptyState from './components/EmptyState';

export default function App() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);
  const { members, loading, error, loadMembers } = useMembers();

  useEffect(() => {
    loadMembers(debounced);
  }, [debounced, loadMembers]);

  const totalMiles = useMemo(() => members.reduce((sum, m) => sum + m.points, 0), [members]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="site-header">
        <div className="container header-inner">
          <h1>Frequent Flyer Portal</h1>
          <p className="muted">Enrol members, log miles, track tiers.</p>
        </div>
      </header>

      <main id="main" className="container">
        <section className="stats" aria-label="Summary">
          <div className="card stat">
            <p className="stat-value">{members.length}</p>
            <p className="muted">Members shown</p>
          </div>
          <div className="card stat">
            <p className="stat-value">{totalMiles.toLocaleString()}</p>
            <p className="muted">Total miles shown</p>
          </div>
        </section>

        <div className="layout">
          <aside>
            <MemberForm />
          </aside>

          <section aria-labelledby="members-title">
            <h2 id="members-title">Members</h2>
            <SearchBar value={search} onChange={setSearch} />

            {loading && <Loader label="Loading members…" />}

            {!loading && error && (
              <div className="alert" role="alert">
                <p>{error}</p>
                <button type="button" className="btn" onClick={() => loadMembers(debounced)}>
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && members.length === 0 && <EmptyState searching={Boolean(debounced)} />}
            {!loading && !error && members.length > 0 && <MemberList members={members} />}
          </section>
        </div>
      </main>
    </>
  );
}
