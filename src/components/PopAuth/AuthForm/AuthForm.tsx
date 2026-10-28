import styles from '@/components/PopAuth/AuthForm/AuthForm.module.css'

type AuthFormProps = {
  buttonText: string;
  children: React.ReactNode;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

export default function AuthForm({
  buttonText,
  children,
  onSubmit,
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.AuthForm__form}>
      {children}
      <button className={styles.AuthForm__button}>{buttonText}</button>
    </form>
  );
}
