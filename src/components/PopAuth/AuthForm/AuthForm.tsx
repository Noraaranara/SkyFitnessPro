import Button from '@/components/Button/Button';
import styles from '@/components/PopAuth/AuthForm/AuthForm.module.css';

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
      <Button type='submit' padding="16px 0" width="full">
        {buttonText}
      </Button>
    </form>
  );
}
