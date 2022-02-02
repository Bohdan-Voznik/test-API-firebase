import './sass/main.scss';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';
import modalTpl from './partials/modal-fim-info.hbs';
import ModalFilm from './js/modal-film-info';
import * as filmsApi from './js/film-list';

import DataBaseAPI from './js/dataBaseAPI';

const dataBaseAPI = new DataBaseAPI();
const modalFilm = new ModalFilm();

const film = {
  id: 1,
  imageUk: 'http://www.hdkinoteatr.com/uploads/posts/2012-05/kp4facbec091fac.jpg',
  imageEn: 'http://www.hdkinoteatr.com/uploads/posts/2012-05/kp4facbec091fac.jpg',
  titleUk: 'title of film',
  titleEn: 'title of film',
  vote: '8.3',
  votes: '12300',
  popularity: '111.2',
  genreUk: 'Genre of film', //Возвращается текст, НЕ ID!
  genreEn: 'Genre of film', //Возвращается текст, НЕ ID!
  aboutUk: `Four of the West’s most infamous outlaws assemble to steal a huge stash of gold from the most corrupt`,
  aboutEn: `Four of the West’s most infamous outlaws assemble to steal a huge stash of gold from the most corrupt`,
  reliseData: '2010',
};
const filmNew = {
  id: 1234,
  imageUk: 'http://www.hdkinoteatr.com/uploads/posts/2012-05/kp4facbec091fac.jpg',
  imageEn: 'http://www.hdkinoteatr.com/uploads/posts/2012-05/kp4facbec091fac.jpg',
  titleUk: 'title of film',
  titleEn: 'title of film',
  vote: '8.3',
  votes: '12300',
  popularity: '111.2',
  genreUk: 'Genre of film', //Возвращается текст, НЕ ID!
  genreEn: 'Genre of film', //Возвращается текст, НЕ ID!
  aboutUk: `Four of the West’s most infamous outlaws assemble to steal a huge stash of gold from the most corrupt`,
  aboutEn: `Four of the West’s most infamous outlaws assemble to steal a huge stash of gold from the most corrupt`,
  reliseData: '2010',
  watched: true,
  queue: true,
};
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

const filmList = document.querySelector('.film__list');
const modalInfo = document.querySelector('.background');
const modalInfoCloseBtn = document.querySelector('.modal__close-btn');
const modalContent = document.querySelector('.modal__content');
const ulItem = document.querySelector('.film__list');
const btnsCategories = document.querySelector('.liberi-categories');

let filmId = null;
let btnWatched = null;
let btnQueue = null;
let filmObj = {};

refs.formAuthentication.addEventListener('submit', onFormAuthenticationSubmit);
// refs.container.addEventListener('click', onContainerClick);
// refs.formAdd.addEventListener('submit', onAddClick);

filmList.addEventListener('click', openInfoModal);
modalInfoCloseBtn.addEventListener('click', closeInfoModal);
btnsCategories.addEventListener('click', openCategory);

function openCategory (e) {
  const categoryStatus = e.target.dataset.category;
  if (categoryStatus === 'watched') {
    const data = filmsApi.createMarkup (dataBaseAPI.user.watched);
    ulItem.innerHTML = data;
    
  }
  if (categoryStatus === 'queue') {
    const data = filmsApi.createMarkup (dataBaseAPI.user.queue);
    ulItem.innerHTML = data;
    console.log(data);
  }
  console.log (e.target);
}
// lol@gmail.com

async function onFormAuthenticationSubmit(e) {
  e.preventDefault();

  const email = e.target.login.value;
  const pasword = e.target.pasword.value;
  await logIn(email, pasword);
  refs.logIn.innerHTML = `${email}`;
  console.log (123, dataBaseAPI.user.watched);
  console.log (filmsApi.createMarkup);

  

  // dataBaseAPI.addMovieToLibrary({
  //   category: dataBaseAPI.user.watched,
  //   film: film,
  // });

  // await dataBaseAPI.removeMovieFromLibrary({
  //   category: dataBaseAPI.user.watched,
  //   id: '0',
  // });
  // console.log('getLiberuStatu: ', dataBaseAPI.getLiberuStatus('1'));

  // console.log('resetLiberuStatus: ', dataBaseAPI.resetLiberuStatus(filmNew));

  // localStorage.setItem('user', JSON.stringify({ email: email, pasword: pasword }));
  // console.log(dataBaseAPI.getFilmByid({ category: dataBaseAPI.user.watched, id: '123' }));

  // console.log(filmObj);
}

// async function onContainerClick(e) {
//   const id = e.target.dataset.id;
//   console.log(id);
//   const dataBaseAPILlo = await dataBaseAPI.removeMovieFromLibrary({
//     category: dataBaseAPI.user.queue,
//     id: id,
//   });

//   createMarkup();
//   console.log(dataBaseAPILlo);
// }

// function createMarkup() {
//   const markups = dataBaseAPI.user.queue
//     .map(markup => {
//       return `<div data-id="${markup}" style="cursor:pointer">${markup}. ID</div><br>`;
//     })
//     .join('');
//   console.log(markups);
//   refs.container.innerHTML = markups;
// }

// function onAddClick(e) {
//   e.preventDefault();
//   const val = e.target.queue.value;
//   const dataBaseAPILlo = dataBaseAPI.addMovieToLibrary({
//     category: dataBaseAPI.user.queue,
//     id: val,
//   });
//   console.log(dataBaseAPILlo);
// }

async function logIn(email, pasword) {
  console.log(await dataBaseAPI.logIn({ email: email, pasword: pasword }));

  // dataBaseAPI.onСhangeUserData([createMarkup]);
  // refs.logIn.innerHTML = dataBaseAPI.user.email;
  // createMarkup();
}

function storageCheck() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return;
  }

  const { email, pasword } = user;
  logIn(email, pasword);
}

function checkButtonData() {
  if (modalFilm.objFilm.watched) btnWatched.classList.add('selected');
  else btnWatched.classList.remove('selected');

  if (modalFilm.objFilm.queue) btnQueue.classList.add('selected');
  else btnQueue.classList.remove('selected');
}

function openInfoModal(e) {
  e.preventDefault();
  const filmCard = e.target.closest('.film__item');
  filmId = filmCard.dataset.id;

  modalFilm.setFilm = dataBaseAPI.getFilmByid({ category: dataBaseAPI.user.watched, id: filmId });

  document.body.style.overflow = 'hidden'; //Запрещаем прокрутку body, пока открыта модалка

  modalContent.insertAdjacentHTML('beforeend', modalFilm.createMarkup());

  //Находим кнопки по data-att:
  btnWatched = document.querySelector('button[data-watched]');
  btnQueue = document.querySelector('button[data-queue]');
  checkButtonData();

  //Вешаем события по кликам на кнопки:
  btnWatched.addEventListener('click', addToWatched);
  btnQueue.addEventListener('click', addToQueue);

  // modalContent.insertAdjacentHTML('beforeend', modalTpl(filmObj));

  if (filmCard) modalInfo.classList.toggle('is-hidden'); //открываем модалку, убирая класс
}

function addToWatched() {
  if (modalFilm.objFilm.watched) {
    btnWatched.classList.remove('selected');
    modalFilm.objFilmWatched = false;
    btnWatched.setAttribute('data-watched', modalFilm.objFilm.watched);
  } else {
    btnWatched.classList.add('selected');
    modalFilm.objFilmWatched = true;
    btnWatched.setAttribute('data-watched', modalFilm.objFilm.watched);
  }
}

function addToQueue() {
  if (modalFilm.objFilm.queue) {
    btnQueue.classList.remove('selected');
    modalFilm.objFilmQueue = false;
    btnQueue.setAttribute('data-queue', modalFilm.objFilm.queue);
  } else {
    btnQueue.classList.add('selected');
    modalFilm.objFilmQueue = true;
    btnQueue.setAttribute('data-queue', modalFilm.objFilm.queue);
  }
}

function closeInfoModal() {
  document.body.style.overflow = 'auto'; //Разрешаем прокрутку body, пока модалка закрыта
  modalInfo.classList.toggle('is-hidden'); //скрываем модалку, вешая класс
  modalContent.innerHTML = ''; //Очистка макета модалки (данные о фильме в объекте загружаются динамически и хранятся в объекте)
  sendObj();
}

function sendObj() {
  console.log('filmObj = ', modalFilm.objFilm);
  'resetLiberuStatus: ', dataBaseAPI.resetLiberuStatus(modalFilm.objFilm);
}
