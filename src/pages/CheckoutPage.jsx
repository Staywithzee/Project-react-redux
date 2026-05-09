import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../features/cart/cartSlice';
import { selectCartItems, selectCartTotal } from '../features/cart/cartSelectors';
import styles from './CheckoutPage.module.css';

const EMPTY = { fullName: '', email: '', address: '', cardNumber: '' };

function validate(fields) {
  const errors = {};
  if (!fields.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!fields.email.trim()) errors.email = 'Email is required.';
  else if (!fields.email.includes('@')) errors.email = 'Email must contain @.';
  if (!fields.address.trim()) errors.address = 'Address is required.';
  if (!fields.cardNumber.trim()) errors.cardNumber = 'Card number is required.';
  else if (!/^\d{16}$/.test(fields.cardNumber.replace(/\s/g, '')))
    errors.cardNumber = 'Card number must be exactly 16 digits.';
  return errors;
}

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  if (items.length === 0 && !success) {
    return (
      <div className={styles.empty}>
        <p>Your cart is empty. Nothing to checkout.</p>
        <button className={styles.backBtn} onClick={() => navigate('/')}>Go Shopping</button>
      </div>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    dispatch(clearCart());
    setSuccess(true);
    setTimeout(() => navigate('/'), 2500);
  };

  if (success) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h2>Order Placed!</h2>
        <p>Thank you for your purchase. Redirecting to home…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Checkout</h1>
      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.sectionTitle}>Shipping Details</h2>
          {[
            { label: 'Full Name', name: 'fullName', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Address', name: 'address', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name} className={styles.field}>
              <label className={styles.label}>{label}</label>
              <input
                type={type}
                name={name}
                value={fields[name]}
                onChange={handleChange}
                className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
              />
              {errors[name] && <p className={styles.errorMsg}>{errors[name]}</p>}
            </div>
          ))}
          <h2 className={styles.sectionTitle}>Payment</h2>
          <div className={styles.field}>
            <label className={styles.label}>Card Number (16 digits)</label>
            <input
              type="text"
              name="cardNumber"
              value={fields.cardNumber}
              onChange={handleChange}
              maxLength={16}
              placeholder="1234567890123456"
              className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
            />
            {errors.cardNumber && <p className={styles.errorMsg}>{errors.cardNumber}</p>}
            {fields.cardNumber.replace(/\s/g, '').length === 16 && (
              <p className={styles.cardHint}>Ending in •••• {fields.cardNumber.slice(-4)}</p>
            )}
          </div>
          <button type="submit" className={styles.submitBtn}>Place Order</button>
        </form>
        <div className={styles.summary}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          {items.map(item => (
            <div key={item.id} className={styles.summaryRow}>
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
