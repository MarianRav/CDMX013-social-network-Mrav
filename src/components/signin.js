import { GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import { onNavigate } from '../main.js';
import { signIn, verifyWithGoogle, redirect } from '../lib/auth.js';

export const LogOn = () => {
  const div = document.createElement('div');
  const title = document.createElement('h2');
  const brandIcon = document.createElement('img');
  const buttonSignIn = document.createElement('button');
  const inputEmail = document.createElement('input');
  const inputPassword = document.createElement('input');
  const errorInput = document.createElement('p');
  const lineSignIn = document.createElement('p');
  const orSignIn = document.createElement('p');
  const askSection = document.createElement('div');
  const buttonGoogle = document.createElement('button');
  const askAccount = document.createElement('p');
  const linkRegister = document.createElement('a');

  title.textContent = 'Welcome back!';
  brandIcon.setAttribute('src', '/images/icon.png');
  brandIcon.classList.add('brandIcon');
  inputEmail.setAttribute('type', 'email');
  inputEmail.placeholder = 'Enter your email';
  inputPassword.placeholder = 'Enter password';
  inputPassword.setAttribute('type', 'password');
  errorInput.classList.add('errorInput');
  buttonSignIn.textContent = 'Sign In';

  buttonSignIn.classList.add('buttonSignInWithEmailAndPassword');
  lineSignIn.classList.add('lineSignIn');
  orSignIn.textContent = 'OR';
  orSignIn.classList.add('orSignIn');
  buttonGoogle.textContent = ('Sign in with Google');
  buttonGoogle.classList.add('buttonGoogle');
  askSection.classList.add('askSeccion');
  askAccount.textContent = 'Don’t have an account ?';
  linkRegister.setAttribute('href', '/register');
  linkRegister.textContent = 'Register';

  buttonSignIn.addEventListener('click', () => {
    const emailValue = inputEmail.value;
    const passwordValue = inputPassword.value;
    if (emailValue === '' || passwordValue === '') {
      errorInput.innerHTML = 'Please fill in the required fields';
    } else {
      signIn(emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          onNavigate('/wall');
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            errorInput.innerHTML = 'Please enter a valid email';
          }
          if (error.code === 'auth/user-not-found') {
            errorInput.innerHTML = 'Please enter a valid email';
          } else if (error.code === 'auth/weak-password') {
            errorInput.innerHTML = 'Please enter a password with at least 6 characters';
          }
        });
    }
  });
  buttonGoogle.addEventListener('click', () => {
    verifyWithGoogle();
    redirect()
      .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
      }).catch((error) => {
      // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      });
    /* .then(() => {
        onNavigate('/wall');
        console.log('signin')
      }); */
  });
  askSection.append(askAccount, linkRegister);

  div.append(title, brandIcon, inputEmail, inputPassword, errorInput, buttonSignIn, lineSignIn, orSignIn, buttonGoogle, askSection);
  return div;
};