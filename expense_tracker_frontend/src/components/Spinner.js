import React from 'react';

// PUBLIC_INTERFACE
export default function Spinner({ text = 'Loading...' }) {
  return (
    <div style={styles.wrap}>
      <div className="spinner" style={styles.spinner} />
      <div>{text}</div>
    </div>
  );
}

const styles = {
  wrap: { display: 'flex', alignItems: 'center', gap: 10, padding: 16 },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid var(--border-color)',
    borderTopColor: 'var(--text-secondary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};
