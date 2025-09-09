import React from 'react';

// PUBLIC_INTERFACE
export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>{title}</div>
      {description && <div style={styles.desc}>{description}</div>}
      {action}
    </div>
  );
}

const styles = {
  card: {
    border: '1px dashed var(--border-color)',
    borderRadius: 12,
    padding: 24,
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    textAlign: 'center'
  },
  title: { fontWeight: 600, marginBottom: 8 },
  desc: { opacity: 0.8 }
};
