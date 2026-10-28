import styles from '@/components/PopAuth/Input/Input.module.css';

type InputTypeProps = {
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  invalid?: boolean;
};

export default function Input({
  type,
  onChange,
  placeholder,
  error,
  invalid,
}: InputTypeProps) {
  return (
    <div className={styles.Input}>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className={`${styles.Input__field} ${
          invalid ? styles.Input__field_error : ''
        }`}
        aria-invalid={invalid || undefined}
      />

      {error && (
        <span className={styles.Input__error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
