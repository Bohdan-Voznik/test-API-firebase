import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, update, onValue, off } from 'firebase/database';

export default class dataBaseApiServise {
  constructor() {
    this.userRefInDatabase = null;
    this.user = {};
    this.firebaseConfig = {
      apiKey: 'AIzaSyDgevhxdEZxnNc8yqSiIrrlMRAzE6e63nU',
      authDomain: 'team-project-js-66dd5.firebaseapp.com',
      databaseURL: 'https://team-project-js-66dd5-default-rtdb.firebaseio.com',
      projectId: 'team-project-js-66dd5',
      storageBucket: 'team-project-js-66dd5.appspot.com',
      messagingSenderId: '48750083472',
      appId: '1:48750083472:web:d4a9cd4b799674e0cbc715',
    };

    this.db = getDatabase(initializeApp(this.firebaseConfig));
  }

  //получаем данные пользователя из БД
  async logIn({ email = null, pasword = null }) {
    const data = await this.getDataByRef(this.formatEmail(email));
    const { pasword: pass, queue: queue, watched: watched } = data === null ? {} : data;
    if (!pass) {
      console.log('Вы не зарегистрированы!!!');
      return 'Error';
    }
    console.log(pasword === String(pass));
    if (pasword !== String(pass)) {
      console.log('Неверный пароль!!!!');
      return 'Error';
    }

    this.userRefInDatabase = await ref(this.db, `users/${this.formatEmail(email)}`);

    this.user.email = email;
    this.user.pasword = pass;
    this.user.queue = this.parsedLibery(queue);
    this.user.watched = this.parsedLibery(watched);
    return 'logIn - OK';
  }

  // Получает мавив с данными пользователя по email
  // Если не передать email получим все данные с базы данных
  async getDataByRef(user = '') {
    const starCountRef = await ref(this.db, `users/${user}`);
    return await (await get(starCountRef)).val();
  }

  //Парсит строку из базы данных в масив
  //Применять для queue и watched
  parsedLibery(array) {
    return array.split(', ');
  }

  reParsedLibery(array) {
    return array.join(', ');
  }

  formatEmail(email) {
    return email.toLowerCase().replaceAll('.', '-0162-');
  }

  reFormatEmail(email) {
    return email.toLowerCase().replaceAll('-0162-', '.');
  }
  //Удаляет фильм из категории (category) по id
  //category (this.user.queue или this.user.watched)
  //id(идентификатор фильма который удаляем)
  removeMovieFromLibrary({ category = null, id = null }) {
    if (!category || !id) {
      return 'Error';
    }
    const index = category.indexOf(id);
    if (index === -1) {
      return;
    }
    category.splice(index, 1);
    console.log('removeMovieFromLibrary: ', this.user);
    this.saveUserDataToDatabase();
    return 'removeMovieFromLibrary - OK';
  }

  addMovieToLibrary({ category = null, id = null }) {
    if (!category || !id) {
      return 'Error';
    }
    const index = category.indexOf(id);
    if (index !== -1) {
      return;
    }

    category.splice(0, 0, id);
    console.log('addMovieToLibrary: ', this.user);
    this.saveUserDataToDatabase();
    return 'addMovieToLibrary - OK';
  }

  //записывает данные пользователя в БД
  saveUserDataToDatabase() {
    const data = {
      pasword: this.user.pasword,
      queue: this.reParsedLibery(this.user.queue),
      watched: this.reParsedLibery(this.user.watched),
    };
    update(this.userRefInDatabase, data);
    console.log('Запись успешна');
  }

  onСhangeUserData(functions = []) {
    onValue(this.userRefInDatabase, async snapshot => {
      console.log('изменения!!');
      const { pasword: paswordDb, queue: queueDb, watched: watchedDb } = await snapshot.val();
      this.user.pasword = paswordDb;
      this.user.queue = this.parsedLibery(queueDb);
      this.user.watched = this.parsedLibery(watchedDb);

      if (functions.length !== 0) {
        functions.map(fn => {
          fn();
        });
      }
    });
  }

  logOut() {
    if (this.userRefInDatabase) {
      off(this.userRefInDatabase);
    }
    this.user = {};
    console.log('12');
    localStorage.removeItem('user');
  }

  async registration({ login = '', pasword = '' }) {
    console.log(login);
    const data = await this.getDataByRef(formatEmail(login));
    console.log('data: ', data);

    if (data !== null) {
      return 'Пользователь уже зарегистрирован!';
    }
    const user = {
      pasword: pasword,
      queue: '',
      watched: '',
    };
    const refs = await ref(this.db, `users/${formatEmail(login)}`);
    update(refs, user);
    return 'Ok';
  }
}
