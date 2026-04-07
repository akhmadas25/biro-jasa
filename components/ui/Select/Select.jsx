'use client';
import React, { useState } from 'react';
import styles from './Select.module.css';

export default function Select({
  label,
  id,
  options = [],
  error,
  className = '',
  onChange,
  value,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`${styles.container} ${className}`}>
      {label && <label htmlFor={id} className={`${styles.label} ${isFocused ? styles.labelActive : ''}`}>{label}</label>}
      <div className={`${styles.selectWrapper} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''}`}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={styles.select}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          <option value="" disabled hidden>Pilih salah satu...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron}>▼</span>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
