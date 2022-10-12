import { onAuthStateChanged, getAuth } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { endSesion, auth } from '../lib/auth.js';
import { onNavigate } from '../main.js';
import {
  postCollection, onRealTime, deleteDocPost, getPost, updatePost, addLikes, removeLikes,
} from '../lib/firestore.js';

// HTML elements
export const wall = () => {
  const div = document.createElement('div');
  const upperBannerDiv = document.createElement('div');
  const growLetters = document.createElement('img');
  const textUserName = document.createElement('p');
  const userIcon = document.createElement('img');
  const makePostForm = document.createElement('form');
  const postTextBox = document.createElement('input');
  const postAlert = document.createElement('p');
  const buttonCreatePost = document.createElement('button');
  const postsSectionDiv = document.createElement('div'); // Sección donde se ven las publicaciones
  const userIconPost = document.createElement('img');
  const text = document.createElement('p');
  const heartIcon = document.createElement('img');
  const likeButton = document.createElement('img');
  const likeCount = document.createElement('p');
  const bottomBannerDiv = document.createElement('div');
  const bottomLine = document.createElement('div');
  const homeIcon = document.createElement('img');
  const logOut = document.createElement('img');

  growLetters.setAttribute('src', '/images/lettering.png');
  userIcon.setAttribute('src', '/images/userIcon.png');
  postTextBox.placeholder = 'What are you thinking?';
  buttonCreatePost.textContent = 'Post';
  userIconPost.setAttribute('src', '/images/userIcon.png');
  text.textContent = 'Remember to water your plants less on winter!';
  heartIcon.setAttribute('src', '/images/heartIcon.png');
  likeButton.setAttribute('src', '/images/likeIcon.png');
  likeCount.textContent = '+ 2 likes';
  homeIcon.setAttribute('src', 'images/homeIcon.png');
  logOut.setAttribute('src', '/images/log-out.png');
  postAlert.textContent = '';

  div.classList.add('wall-div');
  upperBannerDiv.classList.add('upperBannerDiv');
  growLetters.classList.add('growLetters');
  textUserName.classList.add('userName');
  userIcon.classList.add('userIcon');
  postTextBox.classList.add('postTextBox');
  makePostForm.classList.add('makePostForm');
  postAlert.classList.add('postAlert');
  buttonCreatePost.classList.add('postButton');
  postsSectionDiv.classList.add('postsSectionDiv');
  bottomBannerDiv.classList.add('bottomBannerDiv');
  bottomLine.classList.add('bottomLine');
  homeIcon.classList.add('homeIcon');
  logOut.classList.add('logOut');

  const modalEditContainer = document.createElement('dialog');
  modalEditContainer.classList.add('modalBack');
  const modalEditAlert = document.createElement('div');
  modalEditAlert.classList.add('publishedPost');
  const messageEdit = document.createElement('p');
  messageEdit.classList.add('messageEdit');
  const editInput = document.createElement('input');
  editInput.classList.add('editInput');
  const acceptEditButton = document.createElement('button');
  acceptEditButton.classList.add('acceptButton');
  const cancelEditButton = document.createElement('button');
  cancelEditButton.classList.add('cancelButton');
  cancelEditButton.textContent = 'Cancel';
  messageEdit.textContent = 'Edit your post';
  acceptEditButton.textContent = 'Save';

  modalEditAlert.append(messageEdit, editInput, cancelEditButton, acceptEditButton);
  modalEditContainer.append(modalEditAlert);

  const modalDeleteContainer = document.createElement('dialog');
  modalDeleteContainer.classList.add('modalBack');
  const modalDeleteAlert = document.createElement('div');
  modalDeleteAlert.classList.add('publishedPost');
  const messageDelete = document.createElement('p');
  messageDelete.classList.add('messageDelete');
  const acceptDeleteButton = document.createElement('button');
  acceptDeleteButton.classList.add('acceptButton');
  const cancelDeleteButton = document.createElement('button');
  cancelDeleteButton.classList.add('cancelButton');
  cancelDeleteButton.textContent = 'Cancel';
  acceptDeleteButton.textContent = 'Delete';
  messageDelete.textContent = 'Are you sure you want to delete this post?';

  modalDeleteAlert.append(messageDelete, cancelDeleteButton, acceptDeleteButton);
  modalDeleteContainer.append(modalDeleteAlert);

  let editStatus = false;

  // Functions
  const user = auth.currentUser;
  console.log(user);
  onAuthStateChanged(getAuth(), () => {
    if (user) {
      console.log(user.displayName);
      textUserName.textContent = user.email;
    }
    if (user === null) {
      onNavigate('/');
      console.log('No hay usuarios activos');
    }
  });

  onRealTime((querySnapshot) => {
    const postinfo = [];
    postsSectionDiv.innerHTML = '';
    querySnapshot.forEach((doc) => {
      postinfo.push(doc.data());
      const html = `<div class='publishedPost'>
                    <img class='userIcon' src='/images/userIcon.png'>
                    <p class='userName'>${doc.data().user}</p>
                    <p class='publishedText'>${doc.data().post}</p>
                    <img class='heartButton' src='${doc.data().likes.includes(user.uid) ? '/images/likeIcon.png' : '/images/favorite.svg '}' data-id='${doc.id}'>
                    <p class='likeCount'>${doc.data().likes.length} Likes</p>
                    <img class='deleteButton ${doc.data().userID !== user.uid ? 'deleteInactive' : ''}'
                    ' src='/images/delete1.svg' data-id='${doc.id}'>
                    <img class='editButton ${doc.data().userID !== user.uid ? 'editInactive' : ''}' src='/images/edit.png' data-id='${doc.id}'>
                    </div>`;
      postsSectionDiv.innerHTML += html;
    });

    const deletePostButtons = document.querySelectorAll('.deleteButton');
    deletePostButtons.forEach((btn) => {
      btn.addEventListener('click', ({ target: { dataset } }) => {
        console.log(dataset.id);
        modalDeleteContainer.showModal();
        cancelDeleteButton.addEventListener('click', () => {
          modalDeleteContainer.close();
        });
        acceptDeleteButton.addEventListener('click', () => {
          deleteDocPost(dataset.id);
          modalDeleteContainer.close();
        });
      });
    });
    const editPostButtons = document.querySelectorAll('.editButton');
    editPostButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const doc = await getPost(e.target.dataset.id);
        console.log(doc);
        const post = doc.data();

        modalEditContainer.showModal();
        editInput.value = post.post;
        editStatus = true;

        cancelEditButton.addEventListener('click', () => {
          modalEditContainer.close();
        });
        acceptEditButton.addEventListener('click', () => {
          editStatus = true;
          const newInput = editInput.value;
          console.log(doc.id);
          updatePost(doc.id, newInput);
          modalEditContainer.close();
          editStatus = false;
        });
      });
      const likeButtons = document.querySelectorAll('.heartButton');
      likeButtons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          e.stopImmediatePropagation();
          const doc = await getPost(e.target.dataset.id);
          if (doc.data().likes.includes(user.uid)) {
            removeLikes(e.target.dataset.id, user.uid);
          } else {
            addLikes(e.target.dataset.id, user.uid);
            likeCount.textContent = doc.data().likes;
            console.log(likeCount);
            // console.log(likeButtons);
            btn.classList.toggle('heart');
            // console.log(likeButtons);
          }
        });
      });
    });
  });

  // Event Listeners

  makePostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const postValue = postTextBox.value;
    console.log(postValue);
    if (postValue === '') {
      console.log('esta vacío');
      postAlert.innerHTML = 'Before clicking, fill in the field';
      // eslint-disable-next-line no-use-before-define
      cleanP();
    } else {
      postAlert.innerHTML = '';
      postCollection(postValue, user);
      makePostForm.reset();
    }
  });

  logOut.addEventListener('click', () => {
    endSesion()
      .then(() => {
        onNavigate('/');
      });
  });

  function cleanP() {
    setTimeout(() => {
      postAlert.innerHTML = '';
    }, 4000);
  }
  upperBannerDiv.append(growLetters, textUserName, userIcon);
  makePostForm.append(postTextBox, postAlert, buttonCreatePost);
  bottomBannerDiv.append(bottomLine, logOut);

  div.append(modalEditContainer, modalDeleteContainer, upperBannerDiv, makePostForm, postsSectionDiv, bottomBannerDiv);
  return div;
};
