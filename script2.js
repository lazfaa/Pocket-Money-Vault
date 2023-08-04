'use strict';
const openAccBtn = document.querySelector('.open-acc-btn');
const createAccBtn = document.querySelector('.create-acc-btn');
const owner = document.querySelector('.modal__form__Name');
const pin = document.querySelector('.modal__form__PIN');
const currency = document.querySelector('.modal__form__currency');
const locale = document.querySelector('.modal__form__locale');
const modal = document.querySelector('.modal');
const labelScroll = document.querySelector('.about-bank__label');
const section1 = document.querySelector('#section--1');
const mainNavigator = document.querySelector('.main-nav');
const tasksBtns = document.querySelectorAll('.bank-tasks__btn');
const bankTasksContainer = document.querySelector('.bank-tasks');
const bankTasksBtns = document.querySelectorAll('.bank-tasks__btn');
const bankTasksInfos = document.querySelectorAll('.bank-tasks__info');
const aboutBank = document.querySelector('.about-bank');
const mainNavigatorEntries = document.querySelectorAll('.main-nav__entry');
const allSections = document.querySelectorAll('section');
/////////////////////////////////////////////////////
const obsCallBack = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (entry.intersectionRatio >= 0.3) {
    //mainNavigator.classList.add('main-nav--sticky');
  } else if (entry.intersectionRatio <= 0.2) {
    //mainNavigator.classList.remove('main-nav--sticky');
  }
};
const obsOptions = {
  root: null,
  threshold: [0.3111, 0.2],
};
const aboutBankObserver = new IntersectionObserver(obsCallBack, obsOptions);
aboutBankObserver.observe(aboutBank);

allSections.forEach(section => section.classList.add('section--hidden'));

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  entry.target.classList.remove('section--hidden');
  entry.target.classList.add('section--visible');
};
const secObsOptions = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(revealSection, secObsOptions);
allSections.forEach(section => sectionObserver.observe(section));
/////////////////////////////////////////////////////
openAccBtn.addEventListener('click', function () {
  modal.classList.remove('hidden');
  console.log(modal);
});

labelScroll.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

mainNavigator.addEventListener('click', function (e) {
  //stop jump caused by href in main-nav__entry
  e.preventDefault();

  if (e.target.classList.contains('main-nav__entry')) {
    const id = e.target.getAttribute('href');
    const el = document.querySelector(id);
    el.scrollIntoView({ behavior: 'smooth' });
  }
});

bankTasksContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('bank-tasks__btn')) {
    bankTasksBtns.forEach(btn =>
      btn.classList.remove('bank-tasks__btn--active')
    );
    bankTasksInfos.forEach(el => (el.style.display = 'none'));

    e.target.classList.add('bank-tasks__btn--active');
    const num = e.target.getAttribute('id').slice(-1);

    document.getElementById(`bank-tasks__info--${num}`).style.display = 'block';
  }
});

mainNavigator.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('main-nav__entry')) {
    mainNavigatorEntries.forEach(
      entry => (entry.style.color = 'rgb(68,68,68,0.4)')
    );
    e.target.style.color = 'rgb(68,68,68,1)';
  }
});
mainNavigator.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('main-nav__entry')) {
    mainNavigatorEntries.forEach(
      entry => (entry.style.color = 'rgb(68,68,68,1)')
    );
  }
});
//////////////////////////////////////////////
const createAccount = function (e) {
  e.preventDefault();

  if (currency.value !== 'USD' || locale.value !== 'en-US') {
    console.log('Currency should be: USD\nLocale should be: en-US');
    modal.classList.add('hidden');
    return;
  }

  const url = `http://127.0.0.1:3000/create?owner=${owner.value}&pin=${pin.value}&currency=${currency.value}&locale=${locale.value}`;
  console.log(owner.value, pin.value, currency.value, locale.value);
  fetch(url)
    .then(response => {
      console.log(response);
      if (!response.ok) console.log('NOT OK');
      else response.json().then(data => console.log(data));
    })
    .catch(() => console.log('ERR'))
    .finally(() => modal.classList.add('hidden'));
};
createAccBtn.addEventListener('click', createAccount);

////////////////////////////////////////////////////
