import React, { useEffect, useState } from 'react';
import { CategoriesAPI } from '../services/api';
import FormInput from '../components/FormInput';
import EmptyState from '../components/EmptyState';

// PUBLIC_INTERFACE
export default function CategoriesPage() {
  /**
   * Manage categories: create, edit, delete.
   */
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await CategoriesAPI.list();
      setCategories(res || []);
    } catch (error) {
      setErr(error?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await CategoriesAPI.create({ name: name.trim() });
    setName('');
    await fetchAll();
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    if (!editing?.name?.trim()) return;
    await CategoriesAPI.update(editing.id, { name: editing.name.trim() });
    setEditing(null);
    await fetchAll();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await CategoriesAPI.remove(id);
    await fetchAll();
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add Category</h3>
          <form onSubmit={onCreate} style={styles.form}>
            <FormInput name="name" label="Name" value={name} onChange={setName} required />
            <button type="submit" style={styles.btn}>Create</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>All Categories</h3>
          {loading ? (
            <div>Loading...</div>
          ) : err ? (
            <div style={styles.error}>{err}</div>
          ) : categories.length === 0 ? (
            <EmptyState title="No categories" description="Create a category to organize your expenses." />
          ) : (
            <ul style={styles.list}>
              {categories.map((c) => (
                <li key={c.id} style={styles.listItem}>
                  {editing?.id === c.id ? (
                    <form onSubmit={onUpdate} style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
                      <input
                        style={styles.inlineInput}
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      />
                      <button type="submit" style={styles.smallBtn}>Save</button>
                      <button type="button" style={{ ...styles.smallBtn, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setEditing(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      <span>{c.name}</span>
                      <div>
                        <button style={styles.smallBtn} onClick={() => setEditing(c)}>Edit</button>
                        <button style={{ ...styles.smallBtn, ...styles.dangerBtn }} onClick={() => onDelete(c.id)}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '24px auto', padding: '0 16px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr', gap: 16 },
  card: { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 16 },
  cardTitle: { marginTop: 0 },
  form: { display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  btn: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    height: 42
  },
  error: { color: '#d9534f' },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    padding: '10px 12px',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  },
  inlineInput: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  },
  smallBtn: {
    marginLeft: 6,
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer'
  },
  dangerBtn: { background: '#d9534f' }
};
