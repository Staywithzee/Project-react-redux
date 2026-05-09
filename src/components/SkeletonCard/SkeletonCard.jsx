import styles from './SkeletonCard.module.css';

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.title} />
        <div className={styles.subtitle} />
        <div className={styles.button} />
      </div>
    </div>
  );
}
