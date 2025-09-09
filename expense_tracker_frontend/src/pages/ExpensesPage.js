import React, { useEffect, useMemo, useState } from 'react';
import { ExpensesAPI, CategoriesAPI } from '../services/api';
import FormInput from '../components/FormInput';
import Select from '../components/Select';
import EmptyState from '../components/EmptyState';

// PUBLIC_INTERFACE
export default function ExpensesPage() {
  /**
   * Shows expenses in a simple table and allows create, edit, and delete.
   */
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.id, label: c.name })),
    [categories]
  );

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [exp, cats] = await Promise.all([ExpensesAPI.list(), CategoriesAPI.list()]);
      setExpenses(exp || []);
      setCategories(cats || []);
    } catch (err) {
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onCreate = async (payload) => {
    await ExpensesAPI.create(payload);
    await fetchAll();
  };

  const onUpdate = async (id, payload) => {
    await ExpensesAPI.update(id, payload);
    await fetchAll();
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await ExpensesAPI.remove(id);
    await fetchAll();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Expenses</h2>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add Expense</h3>
          <ExpenseForm onSubmit={onCreate} categoryOptions={categoryOptions} />
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>All Expenses</h3>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={styles.error}>{error}</div>
          ) : expenses.length === 0 ? (
            <EmptyState title="No expenses yet" description="Start by adding your first expense." />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr key={e.id}>
                      <td>{formatDate(e.date)}</td>
                      <td>{e.title}</td>
                      <td>${Number(e.amount || 0).toFixed(2)}</td>
                      <td>{categories.find((c) => c.id === e.category_id)?.name || '-'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => setEditing(e)} style={styles.smallBtn}>Edit</button>
                        <button onClick={() => onDelete(e.id)} style={{ ...styles.smallBtn, ...styles.dangerBtn }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div style={styles.modalBackdrop} onClick={() => setEditing(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Edit Expense</h3>
            <ExpenseForm
              initial={editing}
              categoryOptions={categoryOptions}
              onSubmit={async (payload) => {
                await onUpdate(editing.id, payload);
                setEditing(null);
              }}
              onCancel={() => setEditing(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(val) {
  if (!val) return '';
  try {
    const d = new Date(val);
    // ISO only date input support
    return d.toLocaleDateString();
  } catch {
    return val;
  }
}

function ExpenseForm({ initial, onSubmit, onCancel, categoryOptions }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [amount, setAmount] = useState(initial?.amount || '');
  const [date, setDate] = useState(initial?.date ? initial.date.substring(0, 10) : '');
  const [categoryId, setCategoryId] = useState(initial?.category_id || '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        title,
        amount: parseFloat(amount),
        date,
        category_id: categoryId ? Number(categoryId) : null
      };
      await onSubmit(payload);
    } catch (error) {
      setErr(error?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} style={styles.form}>
      <FormInput name="title" label="Title" value={title} onChange={setTitle} required />
      <FormInput name="amount" label="Amount" value={amount} onChange={setAmount} required type="number" step="0.01" min="0" />
      <FormInput name="date" label="Date" value={date} onChange={setDate} required type="date" />
      <Select
        name="category"
        label="Category"
        value={categoryId}
        onChange={setCategoryId}
        options={categoryOptions}
        placeholder="Select a category"
      />
      {err && <div style={styles.error}>{err}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving} style={styles.btn}>{saving ? 'Saving...' : 'Save'}</button>
        {onCancel && <button type="button" onClick={onCancel} style={{ ...styles.btn, background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Cancel</button>}
      </div>
    </form>
  );
}

const styles = {
  container: { maxWidth: 1100, margin: '24px auto', padding: '0 16px' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: '1fr', gap: 16 },
  card: { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 16 },
  cardTitle: { marginTop: 0 },
  form: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  table: { width: '100%', borderCollapse: 'collapse' },
  smallBtn: {
    marginLeft: 6,
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    cursor: 'pointer'
  },
  dangerBtn: { background: '#d9534f' },
  btn: {
    background: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer'
  },
  error: { color: '#d9534f' },
  modalBackdrop: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
  },
  modal: { background: 'var(--bg-primary)', color: 'var(--text-primary)', borderRadius: 12, padding: 20, width: '100%', maxWidth: 520 }
};
