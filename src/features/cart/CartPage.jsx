import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQty } from './cartSlice';
import { selectCartItems, selectCartTotal, selectCartItemCount } from './cartSelectors';
import styles from './CartPage.module.css';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartItemCount);

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>Your cart is empty.</p>
        <button className={styles.shopBtn} onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Shopping Cart ({count} items)</h1>
      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map(item => (
            <div key={item.id} className={styles.row}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.thumb}
                onError={e => { e.target.src = 'https://placehold.co/80x80?text=?'; }}
              />
              <div className={styles.details}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.unitPrice}>${Number(item.price).toFixed(2)} each</p>
              </div>
              <div className={styles.stepper}>
                <button
                  onClick={() => dispatch(updateQty({ id: item.id, quantity: item.quantity - 1 }))}
                  className={styles.stepBtn}
                >−</button>
                <span className={styles.qty}>{item.quantity}</span>
                <button
                  onClick={() => dispatch(updateQty({ id: item.id, quantity: item.quantity + 1 }))}
                  className={styles.stepBtn}
                >+</button>
              </div>
              <p className={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className={styles.removeBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Items ({count})</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span className={styles.free}>Free</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className={styles.checkoutBtn}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
