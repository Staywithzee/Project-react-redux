import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.imageLink}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.image}
          onError={e => { e.target.src = 'https://placehold.co/300x200?text=No+Image'; }}
        />
      </Link>
      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/products/${product.id}`} className={styles.name}>
          {product.name}
        </Link>
        <p className={styles.price}>${Number(product.price).toFixed(2)}</p>
        <button
          className={styles.addBtn}
          onClick={() => dispatch(addToCart(product))}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
