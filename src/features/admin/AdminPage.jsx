import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../products/productsApi';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const navigate = useNavigate();
  const { data: products, isLoading, isError, error } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonGrid}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error?.data?.message || 'Something went wrong'} />;
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteProduct(id);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Product Management</h1>
        <button className={styles.addBtn} onClick={() => navigate('/admin/products/new')}>
          + Add Product
        </button>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className={styles.nameCell}>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className={styles.thumb}
                    onError={e => { e.target.src = 'https://placehold.co/40x40?text=?'; }}
                  />
                  {p.name}
                </td>
                <td><span className={styles.badge}>{p.category}</span></td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td className={p.stock === 0 ? styles.outStock : ''}>{p.stock}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? '...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
