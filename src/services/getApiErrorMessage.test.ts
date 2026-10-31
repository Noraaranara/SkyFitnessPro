import { describe, it, expect } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { getApiErrorMessage } from './getApiErrorMessage';

describe('getApiErrorMessage', () => {
  it('возвращает сообщение от сервера', () => {
    const error = new AxiosError('Request failed');

    error.response = {
      data: { message: 'Неверный пароль' },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    };

    expect(
      getApiErrorMessage(error, 'Произошла ошибка'),
    ).toBe('Неверный пароль');
  });

  it('возвращает сообщение о проблеме с соединением', () => {
    const error = new AxiosError('Network Error');

    expect(
      getApiErrorMessage(error, 'Произошла ошибка'),
    ).toBe('Не удалось связаться с сервером. Проверьте соединение.');
  });

  it('возвращает запасное сообщение для обычной ошибки', () => {
    const error = new Error('Unexpected error');

    expect(
      getApiErrorMessage(error, 'Не удалось выполнить запрос'),
    ).toBe('Не удалось выполнить запрос');
  });
});