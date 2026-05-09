import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
} from '../products/productsApi';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './ProductFormPage.module.css';

const EMPTY = { name: '', price: '', category: '', stock: '', description: '', imageUrl: '' };

function validate(fields) {
  const errors = {};
  if (!fields.name.trim()) errors.name = 'Name is required.';
  if (!fields.price) errors.price = 'Price is required.';
  else if (isNaN(Number(fields.price)) || Number(fields.price) <= 0) errors.price = 'Price must be a positive number.';
  if (!fields.category.trim()) errors.category = 'Category is required.';
  if (!fields.stock) errors.stock = 'Stock is required.';
  else if (isNaN(Number(fields.stock)) || Number(fields.stock) < 0) errors.stock = 'Stock must be a non-negative number.';
  if (!fields.description.trim()) errors.description = 'Description is required.';
  if (!fields.imageUrl.trim()) errors.imageUrl = 'Image URL is required.';
  return errors;
}

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: product, isLoading, isError, error: fetchError } =
    useGetProductByIdQuery(id, { skip: !isEdit });

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFields({
        name: product.name ?? '',
        price: String(product.price ?? ''),
        category: product.category ?? '',
        stock: String(product.stock ?? ''),
        description: product.description ?? '',
        imageUrl: product.imageUrl ?? '',
      });
    }
  }, [product]);

  if (isEdit && isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeletonGrid}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (isEdit && isError) {
    return <ErrorMessage message={fetchError?.data?.message || 'Something went wrong'} />;
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const payload = {
      ...fields,
      price: Number(fields.price),
      stock: Number(fields.stock),
    };

    if (isEdit) {
      await updateProduct({ id, ...payload });
    } else {
      await addProduct(payload);
    }
    navigate('/admin');
  };

  const isBusy = isAdding || isUpdating;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {[
          { label: 'Product Name', name: 'name', type: 'text' },
          { label: 'Price ($)', name: 'price', type: 'number' },
          { label: 'Category', name: 'category', type: 'text' },
          { label: 'Stock', name: 'stock', type: 'number' },
          { label: 'Image URL', name: 'imageUrl', type: 'url' },
        ].map(({ label, name, type }) => (
          <div key={name} className={styles.field}>
            <label className={styles.label}>{label}</label>
            <input
              type={type}
              name={name}
              value={fields[name]}
              onChange={handleChange}
              className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
              min={type === 'number' ? '0' : undefined}
              step={name === 'price' ? '0.01' : '1'}
            />
            {errors[name] && <p className={styles.errorMsg}>{errors[name]}</p>}
          </div>
        ))}
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            name="description"
            value={fields.description}
            onChange={handleChange}
            className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
            rows={4}
          />
          {errors.description && <p className={styles.errorMsg}>{errors.description}</p>}
        </div>
        <div className={styles.formActions}>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)} disabled={isBusy}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={isBusy}>
            {isBusy ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
