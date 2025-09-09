import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with links and logout. */
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={{ ...styles.brand, ...(isActive('/') ? styles.active : {}) }}>💸 ExpenseTracker</Link>
      </div>
      {user && (
        <div style={styles.center}>
          <Link to="/expenses" style={{ ...styles.link, ...(isActive('/expenses') ? styles.active : {}) }}>Expenses</Link>
          <Link to="/categories" style={{ ...styles.link, ...(isActive('/categories') ? styles.active : {}) }}>Categories</Link>
        </div>
      )}
      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.user}>Hello, {user?.name || user?.email}</span>
            <button onClick={logout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ ...styles.link, ...(isActive('/login') ? styles.active : {}) }}>Login</Link>
            <Link to="/register" style={{ ...styles.link, ...(isActive('/register') ? styles.active : {}) }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    padding: '12px 16px',
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  left: { display: 'flex', gap: 12, alignItems: 'center' },
  center: { display: 'flex', gap: 16, alignItems: 'center' },
  right: { display: 'flex', gap: 12, alignItems: 'center' },
  brand: { textDecoration: 'none', fontWeight: 700, color: 'var(--text-primary)' },
  link: { textDecoration: 'none', color: 'var(--text-primary)', opacity: 0.8 },
  active: { opacity: 1, borderBottom: '2px solid var(--text-secondary)' },
  btn: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer'
  },
  user: { color: 'var(--text-primary)', fontSize: 14 }
};
