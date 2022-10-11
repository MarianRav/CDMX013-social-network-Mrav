import {
  getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, limit, doc, deleteDoc, getDoc, updateDoc, arrayUnion
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';
import { app } from './firebase.js';

export const db = getFirestore(app);

export const postCollection = async (postValue, user) => {
  const docRef = await addDoc(collection(db, 'postCollection'), {
    post: postValue,
    user: user.email,
    time: serverTimestamp(),
    likes: [],
  });
  console.log(docRef);
};

const q = query(collection(db, 'postCollection'), orderBy('time', 'desc'), limit(10));
export const onRealTime = (callback) => onSnapshot(q, callback);
export const deleteDocPost = (id) => deleteDoc(doc(db, 'postCollection', id));
export const getPost = (id) => getDoc(doc(db, 'postCollection', id));
export const updatePost = (id, newFields) => updateDoc(doc(db, 'postCollection', id), { post: newFields });
export const addLikes = async (id, user) => {
  const postLikes = await updateDoc(doc(db, 'postCollection', id), { likes: arrayUnion(user) });
};

