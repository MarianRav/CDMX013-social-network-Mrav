import { onAuthStateChanged, getAuth } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { welcome } from './components/welcome.js';
import { register } from './components/register.js';
import { LogOn } from './components/signin.js';
import { wall } from './components/wall.js';

const root = document.getElementById('root');
const routes = {
  '/': welcome,
  '/register': register,
  '/signin': LogOn,
  '/wall': wall,
};
export const onNavigate = (pathname) => {
  window.history.pushState(
    {},
    pathname,
    window.location.origin + pathname,
  );

  root.removeChild(root.firstChild);
  root.appendChild(routes[pathname]());
};

const component = routes[window.location.pathname];

window.onpopstate = () => {
  root.removeChild(root.firstChild);
  root.appendChild(component());
};

root.appendChild(component());

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    onNavigate('/wall');
  }
 /* if (user === null) {
    onNavigate('/');
  }*/
});
