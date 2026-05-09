import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductByIdQuery } from './productsApi';
import { addToCart } from '../cart/cartSlice';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: product, isLoading, isError, error } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonWrap}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error?.data?.message || 'Something went wrong'} />;
  }

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>
      <div className={styles.detail}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.image}
          onError={e => { e.target.src = 'https://placehold.co/500x400?text=No+Image'; }}
        />
        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.meta}>
            <span className={styles.price}>${Number(product.price).toFixed(2)}</span>
            <span className={styles.stock}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <button
            className={styles.addBtn}
            onClick={() => dispatch(addToCart(product))}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
