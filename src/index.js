import './sass/main.scss';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';

import DataBaseAPI from './js/dataBaseAPI';

const dataBaseAPI = new DataBaseAPI();

storageCheck();

dataBaseAPI.logOut();

// console.log(dataBaseAPI.formatEmail('LoL@gmAil.com'));
// console.log(dataBaseAPI.reFormatEmail('lo-0162--0162--0162-l@gmail-0162-com'));

const refs = {
  formAuthentication: document.querySelector('.form-authentication'),
  formAdd: document.querySelector('.form-add'),
  container: document.querySelector('.container'),
  logIn: document.querySelector('.log-in'),
};

refs.formAuthentication.addEventListener('submit', onFormAuthenticationSubmit);
refs.container.addEventListener('click', onContainerClick);
refs.formAdd.addEventListener('submit', onAddClick);

// lol@gmail.com

async function onFormAuthenticationSubmit(e) {
  e.preventDefault();

  const email = e.target.login.value;
  const pasword = e.target.pasword.value;
  logIn(email, pasword);

  localStorage.setItem('user', JSON.stringify({ email: email, pasword: pasword }));
}

async function onContainerClick(e) {
  const id = e.target.dataset.id;
  console.log(id);
  const dataBaseAPILlo = await dataBaseAPI.removeMovieFromLibrary({
    category: dataBaseAPI.user.queue,
    id: id,
  });

  createMarkup();
  console.log(dataBaseAPILlo);
}

function createMarkup() {
  const markups = dataBaseAPI.user.queue
    .map(markup => {
      return `<div data-id="${markup}" style="cursor:pointer">${markup}. ID</div><br>`;
    })
    .join('');
  console.log(markups);
  refs.container.innerHTML = markups;
}

function onAddClick(e) {
  e.preventDefault();
  const val = e.target.queue.value;
  const dataBaseAPILlo = dataBaseAPI.addMovieToLibrary({
    category: dataBaseAPI.user.queue,
    id: val,
  });
  console.log(dataBaseAPILlo);
}

async function logIn(email, pasword) {
  console.log(await dataBaseAPI.logIn({ email: email, pasword: pasword }));
  dataBaseAPI.onСhangeUserData([createMarkup]);
  refs.logIn.innerHTML = dataBaseAPI.user.email;
  createMarkup();
}

function storageCheck() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return;
  }
  const { email, pasword } = user;
  logIn(email, pasword);
}
