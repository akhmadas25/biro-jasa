'use client';
import React, { useState } from 'react';
import styles from './Input.module.css';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  className = '',
  style,
  icon,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`${styles.container} ${className}`} style={style}>
      {label && <label htmlFor={id} className={`${styles.label} ${isFocused || props.value ? styles.labelActive : ''}`}>{label}</label>}
      <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={id}
          type={type}
          className={`${styles.input} ${icon ? styles.hasIcon : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
