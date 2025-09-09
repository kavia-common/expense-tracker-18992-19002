import React from 'react';

// PUBLIC_INTERFACE
export default function Select({ label, value, onChange, options = [], placeholder, name, required }) {
  /** Reusable select with label. */
  return (
    <div style={styles.group}>
      {label && <label style={styles.label} htmlFor={name}>{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={styles.select}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  group: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' },
  label: { fontSize: 14, color: 'var(--text-primary)' },
  select: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  }
};
