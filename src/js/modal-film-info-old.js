import modalTpl from '../partials/modal-fim-info.hbs';

const filmList = document.querySelector('.film__list');
const modalInfo = document.querySelector('.background');
const modalInfoCloseBtn = document.querySelector('.modal__close-btn');
const modalContent = document.querySelector('.modal__content');

let btnWatched = null;
let btnQueue = null;

//Дмитрик объект
const film = {
  id: 12345,
  image: 'http://www.hdkinoteatr.com/uploads/posts/2012-05/kp4facbec091fac.jpg',
  title: 'title of film',
  vote: '8.3',
  votes: '12300',
  popularity: '111.2',
  genre: 'Genre of film', //Возвращается текст, НЕ ID!
  about: `Four of the West’s most infamous outlaws assemble to steal a huge stash of gold from the most corrupt
          settlement
          of the
          gold rush towns. But not all goes to plan one is killed and the other three escapes with bags of gold hide out
          in the
          abandoned gold mine where they happen across another gang of three – who themselves were planning to hit the
          very same
          bank! As tensions rise, things go from bad to worse as they realise the bags of gold are filled with lead...
          they’ve
          been double crossed – but by who and how?`,
};

//Богдан функция(film(id)) ===>
const statusObj = {
  watched: true,
  queue: false,
};

const filmObj = { ...film, ...statusObj };

filmList.addEventListener('click', openInfoModal);
modalInfoCloseBtn.addEventListener('click', closeInfoModal);

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
  const filmCard = e.target.closest('.film__item');
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
  console.log(filmObj);
}
