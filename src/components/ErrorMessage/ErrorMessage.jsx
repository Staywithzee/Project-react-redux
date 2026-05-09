import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ message }) {
  return (
    <div className={styles.container}>
      <span className={styles.icon}>⚠</span>
      <p className={styles.text}>{message || 'Something went wrong'}</p>
    </div>
  );
}
