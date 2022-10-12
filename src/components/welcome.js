import { onNavigate } from '../main.js';

export const welcome = () => {
  const div = document.createElement('div');
  const title = document.createElement('img');
  const buttonSignIn = document.createElement('button');
  const buttonRegister = document.createElement('button');
  const about = document.createElement('h3');
  title.setAttribute('src', '/images/icon.png');
  title.classList.add('imageTitle');
  buttonSignIn.classList.add('buttonSignIn');
  buttonSignIn.textContent = 'Sign In';
  buttonRegister.textContent = 'Register';
  buttonRegister.classList.add('buttonRegister');
  about.textContent = 'Join the largest community of plant Lovers! Find experts, Share your experience, Get plant suppplies and more... Fullfill your dream of having a plant!';

  buttonRegister.addEventListener('click', () => {
    onNavigate('/register');
  });
  buttonSignIn.addEventListener('click', () => {
    onNavigate('/signin');
  });

  div.append(title, about, buttonSignIn, buttonRegister);
  return div;
};
