const SESSION_KEY = 'nexo_session_id';

export const sessionService = {
  getSessionId: () => sessionStorage.getItem(SESSION_KEY),
  setSessionId: (id: string) => sessionStorage.setItem(SESSION_KEY, id),
  clearSession: () => sessionStorage.removeItem(SESSION_KEY),
};
