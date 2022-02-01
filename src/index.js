import './sass/main.scss';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update } from 'firebase/database';
import modalTpl from './partials/modal-fim-info.hbs';

import DataBaseAPI from './js/dataBaseAPI';

const dataBaseAPI = new DataBaseAPI();

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

let filmId = null;
let btnWatched = null;
let btnQueue = null;
let filmObj = {};

refs.formAuthentication.addEventListener('submit', onFormAuthenticationSubmit);
// refs.container.addEventListener('click', onContainerClick);
// refs.formAdd.addEventListener('submit', onAddClick);

filmList.addEventListener('click', openInfoModal);
modalInfoCloseBtn.addEventListener('click', closeInfoModal);

// lol@gmail.com

async function onFormAuthenticationSubmit(e) {
  e.preventDefault();

  const email = e.target.login.value;
  const pasword = e.target.pasword.value;
  await logIn(email, pasword);
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

function createMarkup() {
  const markups = dataBaseAPI.user.queue
    .map(markup => {
      return `<div data-id="${markup}" style="cursor:pointer">${markup}. ID</div><br>`;
    })
    .join('');
  console.log(markups);
  refs.container.innerHTML = markups;
}

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

function loadInfo(filmObj) {
  //Подставляем инфу про фильм в модалку (в hbs):
  modalContent.insertAdjacentHTML('beforeend', modalTpl(filmObj));
}

function checkButtonData() {
  if (filmObj.watched) btnWatched.classList.add('selected');
  else btnWatched.classList.remove('selected');

  if (filmObj.queue) btnQueue.classList.add('selected');
  else btnQueue.classList.remove('selected');
}

function openInfoModal(e) {
  e.preventDefault();
  const filmCard = e.target.closest('.film__item');
  filmId = filmCard.dataset.id;

  filmObj = dataBaseAPI.getFilmByid({ category: dataBaseAPI.user.watched, id: filmId });

  document.body.style.overflow = 'hidden'; //Запрещаем прокрутку body, пока открыта модалка
  loadInfo(filmObj); //Передаем в функцию объект:

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

function closeInfoModal() {
  document.body.style.overflow = 'auto'; //Разрешаем прокрутку body, пока модалка закрыта
  modalInfo.classList.toggle('is-hidden'); //скрываем модалку, вешая класс
  modalContent.innerHTML = ''; //Очистка макета модалки (данные о фильме в объекте загружаются динамически и хранятся в объекте)
  sendObj(filmObj);
}

//Обработка кликов по кнопкам в модалке:

function addToWatched() {
  //Запуск функции отслеживания

  if (filmObj.watched) {
    btnWatched.classList.remove('selected');
    filmObj.watched = false;
    btnWatched.setAttribute('data-watched', filmObj.watched);
  } else {
    btnWatched.classList.add('selected');
    filmObj.watched = true;
    btnWatched.setAttribute('data-watched', filmObj.watched);
  }
}

function addToQueue() {
  if (filmObj.queue) {
    btnQueue.classList.remove('selected');
    filmObj.queue = false;
    btnQueue.setAttribute('data-queue', filmObj.queue);
  } else {
    btnQueue.classList.add('selected');
    filmObj.queue = true;
    btnQueue.setAttribute('data-queue', filmObj.queue);
  }
}

function sendObj(filmObj) {
  console.log('filmObj = ', filmObj);
  'resetLiberuStatus: ', dataBaseAPI.resetLiberuStatus(filmObj);
}
