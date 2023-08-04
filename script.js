'use strict';
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,

//   movementsDates: [
//     '2019-11-18T21:31:17.178Z',
//     '2019-12-23T07:42:02.383Z',
//     '2020-01-28T09:15:04.904Z',
//     '2020-04-01T10:17:24.185Z',
//     '2020-05-08T14:11:59.604Z',
//     '2020-05-27T17:01:17.194Z',
//     '2020-07-11T23:36:17.929Z',
//     '2020-07-12T10:51:36.790Z',
//   ],
//   currency: 'EUR',
//   locale: 'pt-PT', // de-DE
// };

// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,

//   movementsDates: [
//     '2019-11-01T13:15:33.035Z',
//     '2019-11-30T09:48:16.867Z',
//     '2019-12-25T06:04:23.907Z',
//     '2020-01-25T14:18:46.235Z',
//     '2020-02-05T16:33:06.386Z',
//     '2020-04-10T14:43:26.374Z',
//     '2020-06-25T18:49:59.371Z',
//     '2020-07-26T12:01:20.894Z',
//   ],
//   currency: 'USD',
//   locale: 'en-US',
// };
// const accounts = [account1, account2];
// const createUsernames = function (accounts) {
//   accounts.forEach(function (entry) {
//     entry.username = entry.owner
//       .toLowerCase()
//       .split(' ')
//       .map(partName => partName[0])
//       .join('');
//   });
// };

// createUsernames(accounts);
///////////////////////////////////////////////////
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.logout__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const valSortBtn = document.querySelector('.value-sort-btn');
///////////////////////////////////////////////////////////////////////
let currentaccount;
const optionsdatetime = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const owner = inputLoginUsername.value;
  const pin = parseInt(inputLoginPin.value, 10);

  const url = `http://127.0.0.1:3000/login?owner=${owner}&pin=${pin}`;
  console.log(owner, pin);
  fetch(url)
    .then(response => {
      console.log(response);
      if (!response.ok) console.log('NOT OK');
      else
        response.json().then(function (data) {
          console.log(data);
          if (data.owner) {
            currentaccount = data;
            containerApp.style.opacity = '100';
            labelWelcome.textContent = `Welcome back! ${
              currentaccount.owner.split(' ')[0]
            }`;
            valSortBtn.textContent = 'VALUE';
            labelDate.textContent = displayIntlDateTime(
              currentaccount,
              new Date()
            );
            displayMovements(currentaccount);
            displaySummary(currentaccount);
            displayCurrAccBalance(currentaccount);
            displayLogoutTimer(currentaccount);
          } else console.log('WRONG USERNAME OR PASSWORD');
        });
    })
    .catch(() => console.log('ERR'))
    .finally(() => aboutBank.classList.add('hidden'));

  /*const tempaccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );*/
  inputLoginPin.value = inputLoginUsername.value = '';
});
/////////////////////////////////////////////////////////////////
const displayMovements = function (acc) {
  containerMovements.innerHTML = '';
  const optionscurrency = {
    style: 'currency',
    currency: `${acc.currency}`,
  };
  acc.movements.forEach(function (mov, i) {
    const type = mov < 0 ? 'withdrawal' : 'deposit';

    const formatteddate = displayIntlDateTime(
      acc,
      new Date(acc.movementsDates[i])
    );
    const currencyval = Intl.NumberFormat(acc.locale, optionscurrency).format(
      mov.toFixed(2)
    );
    const html_movrow = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${formatteddate}</div>
    <div class="movements__value">${currencyval}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html_movrow);
  });
};
const displaySortedMovements = function (acc) {
  containerMovements.innerHTML = '';
  const sortedmovs = acc.movements.slice(0);
  const optionscurrency = {
    style: 'currency',
    currency: `${acc.currency}`,
  };
  //const sortedmovsdate = acc.movementsDates.slice(0);

  sortedmovs.sort((a, b) => (a <= b ? -1 : 1));

  sortedmovs.forEach(function (mov, i) {
    const type = mov < 0 ? 'withdrawal' : 'deposit';
    const currencyval = Intl.NumberFormat(acc.locale, optionscurrency).format(
      mov.toFixed(2)
    );

    const html_movrow = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${currencyval}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html_movrow);
  });
};
btnSort.addEventListener('click', function () {
  const value = valSortBtn.textContent;

  if (value == 'VALUE') {
    displaySortedMovements(currentaccount);
    valSortBtn.textContent = 'DATE';
  } else {
    displayMovements(currentaccount);
    valSortBtn.textContent = 'VALUE';
  }
});
const displayCurrAccBalance = function (curracc) {
  const totbalance = curracc.movements
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);
  labelBalance.textContent = Intl.NumberFormat(curracc.locale, {
    style: 'currency',
    currency: `${curracc.currency}`,
  }).format(totbalance);
};
const displaySummary = function (acc) {
  const inmoney = acc.movements
    .filter(entry => entry > 0)
    .reduce((acc, curr) => acc + curr, 0);
  const outmoney = -acc.movements
    .filter(entry => entry < 0)
    .reduce((acc, curr) => acc + curr, 0);
  const optionscurrency = { style: 'currency', currency: `${acc.currency}` };
  //console.log(inmoney, outmoney);
  labelSumIn.textContent = Intl.NumberFormat(
    acc.locale,
    optionscurrency
  ).format(inmoney.toFixed(2));
  labelSumOut.textContent = Intl.NumberFormat(
    acc.locale,
    optionscurrency
  ).format(outmoney.toFixed(2));
  labelSumInterest.textContent = acc.interestRate;
};
////////////////////////////////////////////////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiver = inputTransferTo.value;
  const amt = Number(inputTransferAmount.value);

  const currbalance = currentaccount.movements.reduce(
    (acc, entry) => acc + entry
  );
  console.log('PREVIOUS BALANCE:', currbalance);

  const timestamp = new Date().toISOString();
  const url = `http://127.0.0.1:3000/transfer?owner=${currentaccount.owner}&pin=${currentaccount.pin}&receiver=${receiver}&amt=${amt}&timestamp=${timestamp}`;

  if (amt <= currbalance && amt > 0 && amt <= 100000) {
    fetch(url)
      .then(response => {
        response
          .json()
          .then(data => {
            if (data.message === 'resolved') {
              console.log('Money transferred');
              currentaccount = data.account;
              displayMovements(currentaccount);
              displayCurrAccBalance(currentaccount);
              displaySummary(currentaccount);
              console.log('MONEY SENT');
            } else console.log('Transfer did not take place/Account not exist');
          })
          .catch(() => coonsole.log('SOMETHING WRONG IN RESPONSE.JSON'));
      })
      .finally(() => (inputTransferAmount.value = inputTransferTo.value = ''));
  } else console.log('NOT ENOUGH BALANCE OR INVALID TRANSFER AMT');
  /*if (
    useracc &&
    currentaccount.username != username &&
    amt <= 1000000 &&
    0 < amt
  ) {
    if (amt <= currbalance) {
      useracc.movements.push(amt);
      useracc.movementsDates.push(new Date().toISOString());
      currentaccount.movements.push(-amt);
      currentaccount.movementsDates.push(new Date().toISOString());
      
    }
  } else console.log('NO SUCH USER OR AMT INVALID');*/

  inputTransferAmount.value = inputTransferTo.value = '';
});
///////////////////////////////////////////////

///////////////////////////////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const owner = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  const url = `http://127.0.0.1:3000/close?owner=${owner}&pin=${pin}`;
  console.log(currentaccount);
  console.log(owner, pin);

  if (owner === currentaccount.owner && pin === currentaccount.pin) {
    fetch(url)
      .then(response => {
        response.json().then(data => {
          if (data.message === 'resolved') {
            currentaccount = 0;
            containerApp.style.opacity = 0;
            labelWelcome.textContent = 'Login to access account';
            console.log('CLOSED');
          } else {
            console.log('SOMETHING WENT WRONG, ACC NOT CLOSED');
          }
        });
      })
      .catch(() => console.log('SOMETHING WENT WRONG, ACC NOT CLOSED'))
      .finally(() => (inputCloseUsername.value = inputClosePin.value = ''));
  } else {
    console.log('WRONG USERNAME/PASSWORD');
    inputCloseUsername.value = inputClosePin.value = '';
  }
});
btnLogout.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  //console.log(currentaccount);
  if (username === currentaccount.owner && pin === currentaccount.pin) {
    currentaccount = 0;
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Login to access account';
  } else console.log('STILL LOGGED IN');
});
const displayLogoutTimer = function (acc) {
  labelTimer.textContent = '10:00';
  let timeleft = 600;

  const timer = setInterval(function () {
    timeleft--;

    labelTimer.textContent = `${parseInt(timeleft / 60)}:${parseInt(
      timeleft % 60
    )}`;

    if (parseInt(timeleft) == 0) {
      currentaccount = 0;
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Login to access account';
      clearInterval(timer);
    } else if (currentaccount.username != acc.username) clearInterval(timer);
    //console.log(time);
  }, 1000);
};
/////////////////////////////////////////////////
const displayIntlDateTime = function (acc, date) {
  return new Intl.DateTimeFormat(acc.locale, optionsdatetime).format(date);
};
const timeWithColons = function (date) {
  return `${('' + date.getHours()).padStart(2, '0')}:${(
    '' + date.getMinutes()
  ).padStart(2, '0')}`;
};
const dateWithSlashes = function (date) {
  return `${('' + date.getDate()).padStart(2, 0)}/${(
    '' +
    (date.getMonth() + 1)
  ).padStart(2, 0)}/${date.getFullYear()}`;
};
/////////////////////////////////////////////////////
