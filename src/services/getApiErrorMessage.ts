
import axios from 'axios';

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Не удалось связаться с сервером. Проверьте соединение.';
    }

    return (
      error.response.data?.message ||
      fallback
    );
  }

  return fallback;
};
