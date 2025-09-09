import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login form page. On success redirects to /expenses. */
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/expenses');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back</h2>
        <form onSubmit={onSubmit} style={styles.form}>
          <FormInput name="email" label="Email" type="email" value={email} onChange={setEmail} required />
          <FormInput name="password" label="Password" type="password" value={password} onChange={setPassword} required />
          {error && <div style={styles.error}>{error}</div>}
          <button type="submit" disabled={submitting} style={styles.btn}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={styles.switch}>
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 420, margin: '40px auto', padding: '0 16px' },
  card: { background: 'var(--bg-secondary)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' },
  title: { margin: 0, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  btn: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer'
  },
  switch: { marginTop: 12, fontSize: 14 },
  error: { color: '#d9534f', fontSize: 14 }
};
