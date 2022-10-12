import { onNavigate } from '../main.js';
import { createAccount, redirect, verifyWithGoogle } from '../lib/auth.js';


export const register = () => {
  const div = document.createElement('div');
  const title = document.createElement('h2');
  const lettering = document.createElement('img');
  const inputEmail = document.createElement('input');
  const inputPassword = document.createElement('input');
  const inputUserName = document.createElement('input');
  const buttonRegister = document.createElement('button');
  const buttonGoogle = document.createElement('button');
  const errorInput = document.createElement('p');
  const lineRegister = document.createElement('p');
  const lineOr = document.createElement('p');
  const askSection = document.createElement('div');
  const askRegister = document.createElement('p');
  const linkSignin = document.createElement('a');

  title.textContent = 'Welcome to';
  lettering.setAttribute('src', '/images/lettering.png');
  lettering.classList.add('growRegister');
  inputEmail.setAttribute('type', 'email');
  inputEmail.placeholder = 'Enter your email';
  inputPassword.setAttribute('type', 'password');
  inputPassword.placeholder = 'Enter password';
  inputUserName.placeholder = 'Enter a Username';
  buttonRegister.textContent = 'Register';
  buttonRegister.classList.add('buttonRegister2');
  buttonGoogle.textContent = ('Register with Google');
  buttonGoogle.classList.add('buttonGoogle');
  errorInput.classList.add('errorInput');
  lineRegister.classList.add('lineRegister');
  lineOr.textContent = 'OR';
  lineOr.classList.add('lineOr');
  askSection.classList.add('askSeccion');
  askRegister.textContent = 'Already have an account ?';
  linkSignin.setAttribute('href', '/signin');
  linkSignin.textContent = 'Sign In';

  buttonRegister.addEventListener('click', () => {
    const userNameValue = inputUserName.value;
    const emailValue = inputEmail.value;
    const passwordValue = inputPassword.value;
    if (emailValue === '' || passwordValue === '' || userNameValue === '') {
      errorInput.innerHTML = 'Please fill in the required fields';
    } else {
      createAccount(emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          user.displayName = userNameValue;
          console.log(user.displayName);
          onNavigate('/signin');
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            errorInput.innerHTML = 'This email is already in use';
          } else if (error.code === 'auth/invalid-email') {
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
        onNavigate('/wall');
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = verifyWithGoogle.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
      }).catch((error) => {
      // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        const credential = verifyWithGoogle.credentialFromError(error);
      // ...
      });
  });
  askSection.append(askRegister, linkSignin);

  div.append(title, lettering, inputUserName, inputEmail, inputPassword, errorInput, buttonRegister, lineRegister, lineOr, buttonGoogle, askSection);
  return div;
};
