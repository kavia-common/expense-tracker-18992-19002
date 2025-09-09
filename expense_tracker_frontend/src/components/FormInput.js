import React from 'react';

// PUBLIC_INTERFACE
export default function FormInput({ label, type = 'text', value, onChange, placeholder, required, min, step, name }) {
  /** Reusable input with label and consistent styling. */
  return (
    <div style={styles.group}>
      {label && <label style={styles.label} htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  group: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' },
  label: { fontSize: 14, color: 'var(--text-primary)' },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  }
};
