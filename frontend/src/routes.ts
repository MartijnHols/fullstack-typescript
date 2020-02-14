// This is also used by the backend to determine which routes should serve the app
// TODO: That ^
const routes = {
  home: '/',
  content: '/content',
  user: '/user/:clientId',
  login: '/login',
  register: '/register',
  about: '/about',
  textChat: '/text-chat',
}

export default routes
