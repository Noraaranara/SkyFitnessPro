
import { describe, it, expect } from 'vitest';
import {
  authSliceReducer,
  setUser,
  setToken,
  clearUser,
  setLoading,
  setError,
  openAuthModal,
  closeAuthModal,
} from './authSlice';

const testUser = {
  _id: '123',
  email: 'test@example.com',
  selectedCourses: ['course-1'],
  courseProgress: [],
};

describe('authSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = authSliceReducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      user: null,
      token: null,
      isAuth: false,
      isLoading: false,
      error: null,
      isAuthModalOpen: false,
    });
  });

  it('сохраняет токен', () => {
    const state = authSliceReducer(undefined, setToken('test-token'));

    expect(state.token).toBe('test-token');
  });

  it('сохраняет пользователя и меняет isAuth в true, если есть токен', () => {
    const stateWithToken = authSliceReducer(
      undefined,
      setToken('test-token'),
    );

    const state = authSliceReducer(stateWithToken, setUser(testUser));

    expect(state.user).toEqual(testUser);
    expect(state.isAuth).toBe(true);
  });

  it('меняет isAuth в false, если нет токена', () => {
    const state = authSliceReducer(undefined, setUser(testUser));

    expect(state.user).toEqual(testUser);
    expect(state.isAuth).toBe(false);
  });

  it('очищает пользователя при выходе', () => {
    const stateWithToken = authSliceReducer(
      undefined,
      setToken('test-token'),
    );

    const authenticatedState = authSliceReducer(
      stateWithToken,
      setUser(testUser),
    );

    const state = authSliceReducer(authenticatedState, clearUser());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuth).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('изменяет состояние загрузки', () => {
    const state = authSliceReducer(undefined, setLoading(true));

    expect(state.isLoading).toBe(true);
  });

  it('сохраняет ошибку', () => {
    const state = authSliceReducer(
      undefined,
      setError('Ошибка авторизации'),
    );

    expect(state.error).toBe('Ошибка авторизации');
  });

  it('очищает ошибку', () => {
    const stateWithError = authSliceReducer(
      undefined,
      setError('Ошибка авторизации'),
    );

    const state = authSliceReducer(stateWithError, setError(null));

    expect(state.error).toBeNull();
  });

  it('открывает окно авторизации', () => {
    const state = authSliceReducer(undefined, openAuthModal());

    expect(state.isAuthModalOpen).toBe(true);
  });

  it('закрывает окно авторизации', () => {
    const stateWithOpenModal = authSliceReducer(
      undefined,
      openAuthModal(),
    );

    const state = authSliceReducer(
      stateWithOpenModal,
      closeAuthModal(),
    );

    expect(state.isAuthModalOpen).toBe(false);
  });
});
