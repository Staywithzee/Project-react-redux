import { useDispatch, useSelector } from 'react-redux';
import { useGetProductsQuery } from './productsApi';
import { setSearchQuery, setActiveCategory } from '../ui/uiSlice';
import { selectFilteredProducts } from './productsSelectors';
import ProductCard from '../../components/ProductCard/ProductCard';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './ProductListPage.module.css';

export default function ProductListPage() {
  const dispatch = useDispatch();
  const { data: products, isLoading, isError, error } = useGetProductsQuery();
  const searchQuery = useSelector(state => state.ui.searchQuery);
  const activeCategory = useSelector(state => state.ui.activeCategory);
  const filtered = useSelector(state => selectFilteredProducts(state, products));

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error?.data?.message || 'Something went wrong'} />;
  }

  const categories = ['All', ...new Set(products.map(p => p.category))];

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => dispatch(setSearchQuery(e.target.value))}
          className={styles.search}
        />
        <div className={styles.tabs}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.tab} ${activeCategory === cat ? styles.activeTab : ''}`}
              onClick={() => dispatch(setActiveCategory(cat))}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className={styles.empty}>No products match your search.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
