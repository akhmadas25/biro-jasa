'use client';
import React from 'react';
import styles from './Button.module.css';
import { Loader2 } from 'lucide-react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon,
  className = '',
  ...props 
}) {
  const btnClass = `${styles.button} ${styles[variant]} ${styles[size]} ${isLoading ? styles.loading : ''} ${className}`;

  return (
    <button className={btnClass} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <Loader2 className={styles.spinner} size={18} />
      ) : (
        icon && <span className={styles.icon}>{icon}</span>
      )}
      <span className={styles.text}>{children}</span>
      <div className={styles.ripple}></div>
    </button>
  );
}
