export const setSessionId = (sessionId: string) =>
  localStorage.setItem('sessionId', sessionId)

export const getSessionId = () => localStorage.getItem('sessionId')
