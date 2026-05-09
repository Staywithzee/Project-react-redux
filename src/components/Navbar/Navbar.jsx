import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItemCount } from '../../features/cart/cartSelectors';
import styles from './Navbar.module.css';

export default function Navbar() {
  const count = useSelector(selectCartItemCount);

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        ShopReact
      </Link>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>Store</Link>
        <Link to="/admin" className={styles.link}>Admin</Link>
        <Link to="/cart" className={styles.cartLink}>
          <span className={styles.cartIcon}>🛒</span>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </Link>
      </div>
    </nav>
  );
}
