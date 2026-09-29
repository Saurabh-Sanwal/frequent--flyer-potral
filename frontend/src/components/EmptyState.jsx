export default function EmptyState({ searching }) {
  return (
    <div className="empty" role="status">
      <h3>No data found</h3>
      <p>
        {searching
          ? 'No members match your search. Try a different name, email or member ID.'
          : 'No members yet. Enrol the first member using the form.'}
      </p>
    </div>
  );
}
