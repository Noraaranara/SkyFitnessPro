import styles from '@/components/Button/Button.module.css';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  width?: 'auto' | 'full' | string;
  padding?: string;
  radius?: string;
};

export default function Button({
  children,
  variant = 'primary',
  width = 'auto',
  padding,
  radius,
  className = '',
  style,
  type = 'button',
  ...props
}: ButtonProps) {
  const customStyles: CSSProperties = {
    ...style,
    ...(width === 'auto' || width === 'full' ? {} : { width }),
    ...(width === 'full' ? { width: '100%' } : {}),
    ...(padding ? { padding } : {}),
    ...(radius ? { borderRadius: radius } : {}),
  };

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`}
      style={customStyles}
      {...props}
    >
      {children}
    </button>
  );
}
