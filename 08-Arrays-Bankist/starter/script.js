'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Displaying the movements of account
const displayMovements = function (movements) {
  //set the previously inserted html in container movements to empty
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${Math.abs(mov)}</div>
  </div>`;
    //takes the html to add and the position
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//compute username for each user
const user = 'Steven Thomas Williams';
const createUsername = function (accts) {
  accts.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};
//calculate and print balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((sum, currVal) => sum + currVal, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

//calculate the summary of account
const calcSummary = function (movements, interestRate) {
  //INCOME
  const income = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = income + '€';
  //OUTGOING
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = Math.abs(out) + '€';

  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => {
      const int = (mov * interestRate) / 100;
      if (int >= 1) return int;
      else return 0;
    })
    .reduce((acc, mov) => mov + acc, 0);
  labelSumInterest.textContent = Math.round(interest) + '€';
};
// UPDATE UI
const updateUI = function (acc) {
  //calling functions
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcSummary(acc.movements, acc.interestRate);
};
//declaring current account
let acc;

// Button login
btnLogin.addEventListener('click', function (e) {
  //this will prevent form from submitting
  e.preventDefault();
  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);
  acc = accounts.find(acct => acct.username === inputUsername);
  //Optional Chaining --if account exists then find the pin
  if (acc?.pin === inputPin) {
    //Display UI and Welcome Message
    labelWelcome.textContent = `Welcome to Bankist ! ${
      acc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Empty the fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    //Blur method to loose focus from field
    inputLoginPin.blur();

    updateUI(acc);
  }
});

//Transfer Amount
btnTransfer.addEventListener('click', function (e) {
  //prevent submit
  e.preventDefault();
  //fetching input field values
  const inputUsername = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);

  //get the requested username
  const receiverAccount = accounts.find(function (acc) {
    return acc.username === inputUsername;
  });
  //transfer the amount
  if (
    amount > 0 &&
    receiverAccount &&
    amount <= acc.balance &&
    receiverAccount?.username !== acc.username
  ) {
    //transfer balance
    acc.balance -= amount;
    receiverAccount.balance += amount;
    //update transactions
    receiverAccount.movements.push(amount);
    acc.movements.push(-amount);
    //empty field
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    inputTransferAmount.blur();
    //updateUI
    updateUI(acc);
  }
});

//Delete Account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const inputUsername = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  const index = accounts.findIndex(acc => acc.username === inputUsername);
  console.log(index);
  if (inputUsername === acc.username && pin === acc.pin) {
    const index = accounts.findIndex(acc => acc.username === inputUsername);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//Requesting Loan

//Some() function vs includes function
//some() function could search for value and returns T/F based on some condition
//every() function looks for each element satisfying the condition and return T/F based on that
//includes() only checks the value for equality

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0 && acc.movements.some(mov => mov >= loanAmount * 0.1)) {
    acc.balance += loanAmount;
    acc.movements.push(loanAmount);
    updateUI(acc);
  }
  inputLoanAmount.value = '';
});
createUsername(accounts);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// // const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// /////////////////////////////////////////////////

// //----SLICE METHOD-----
// //Makes a shallow copy of the array
// //does not manipulate the original array
// let arr = ['a', 'b', 'c', 'd', 'e', 'f', ''];
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-1));
// console.log(arr.slice(2, -2));
// console.log(arr);

// //----SPLICE METHOD------
// //It mutates the original array
// //The spliced part is removed from array
// //Usually used to remove one or more elements from original array
// console.log(arr.splice(2, 4));
// console.log(arr);

// //---REVERSE METHOD---
// //Mutates the original array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());

// //CONCAT array
// //does not mutates original array
// console.log(arr.concat(arr2));
// console.log(arr);
// console.log([...arr, ...arr2]);

// //JOIN METHOD
// console.log(arr.concat(arr2).join('-'));

// //-- at() method

// console.log(arr[0]);
// console.log(arr.at(0));

// // getting the last element
// console.log(arr[arr.length - 1]);
// //get a new arr and at the last element, access through the zero index
// console.log(arr.slice(-1)[0]);
// //can be done now using this method --can also be used on string as well
// console.log(arr.at(-1));

// //----------------FOREACH METHOD---------//
// //It takes a callback method that forEach calls for each iteration

// //Syntax
// // array.forEach(function (currentElement, index, array) {});

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// movements.forEach(function (movement, i) {
//   if (movement > 0) console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   else console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
// });

// //When to use it?
// //You cannot break out of forEach loop
// // Other than that, it depends on your personal preferences.

// //-----ForEach FOR MAPS-----------//
// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// //SET----//
// const currenciesUnique = new Set(['USD', 'GDP', 'USD', 'EUR']);

// //_ is a convention to ignore values
// currenciesUnique.forEach(function (value, _, set) {
//   console.log(value);
// });

// //-----------------------------------CODING CHALLENGE 1-------------------------------------//
// /*
// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners
// about their dog's age, and stored the data into an array (one array for each). For
// now, they are just interested in knowing whether a dog is an adult or a puppy.
// A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years
// old.
// Your tasks:
// Create a function 'checkDogs', which accepts 2 arrays of dog's ages
// ('dogsJulia' and 'dogsKate'), and does the following things:
// 1. Julia found out that the owners of the first and the last two dogs actually have
// cats, not dogs! So create a shallow copy of Julia's array, and remove the cat
// ages from that copied array (because it's a bad practice to mutate function
// parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1
// is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy
// �
// ")
// 4. Run the function for both test datasets
// Test data:
// § Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// Hints: Use tools from all lectures in this section so far �
// GOOD LUCK �
// */

// const checkDogsAge = function (dogsJulia, dogsKate) {
//   const juliaDogsCorrect = dogsJulia.slice(1, -2);
//   const allDogs = [...juliaDogsCorrect, ...dogsKate];
//   allDogs.forEach(function (age, i) {
//     console.log(
//       `Dog number ${i + 1} is ${
//         age >= 3 ? `an adult, and is ${age} years old` : `still a puppy`
//       }`
//     );
//   });
// };

// // const juliaDogs = [3, 5, 2, 12, 7];
// const juliaDogs = [9, 16, 6, 8, 3];
// // const kateDogs = [4, 1, 15, 8, 3];
// const kateDogs = [10, 5, 6, 1, 4];

// checkDogsAge(juliaDogs, kateDogs);

// //----------------DATA TRANSFORMATION METHODS ---------------------//

// //THREE METHODS
// //MAP
// /*
// IT IS SIMILAR TO FOREACH LOOP BUT INSTEAD IT PERFORMS SOME OPERATION ON EACH ELEMENT AND MAPS IT TO A NEW ARRAY
// */
// //FILTER
// /*
// fILTER RETURNS A NEW ARRAY CONTAINING THE ARRAY ELEMENTS THAT PASSED A QUALIFIED TEST CONDITION
// */
// //REDUCE
// /*
// REDUCES ALL ELEMENTS TO A SINGLE ELEMENT EXAMPLE: ACCUMULATOR + CURRENT FUNCTION
// */

// //------MAP() METHODS ------------//

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// console.log(movements, movementsUSD);

// //foreach method causes side effects causing lines to print in each iteration
// //map simply returns the resultant to a new array element and prints the whole array at once. DOES NOT CAUSE SIDE EFFECT

// //--------------FILTER() METHOD--------------//
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// console.log(deposits);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// //-----------REDUCE() Method-----------------------//
// //has first parameter of accumulator in callback function
// //the second parameter of reduce() function is the initial value of accumulator in first iteration

// //example
// const totalBalance = movements.reduce(function (acc, value, i, arr) {
//   return acc + value;
// }, 0);

// console.log(totalBalance);

// //return max balance
// //the return value in each iteration is assigned to accumulator
// const maxBalance = movements.reduce(
//   (acc, curr) => (curr > acc ? curr : acc),
//   movements[0]
// );
// console.log(maxBalance);

// //---------------CODING CHALLENGE 2------------------------//
// /*
// Let's go back to Julia and Kate's study about dogs. This time, they want to convert
// dog ages to human ages and calculate the average age of the dogs in their study.
// Your tasks:
// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's
// ages ('ages'), and does the following things in order:
// 1. Calculate the dog age in human years using the following formula: if the dog is
// <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
// humanAge = 16 + dogAge * 4
// 2. Exclude all dogs that are less than 18 human years old (which is the same as
// keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know
// from other challenges how we calculate averages �)
// 4. Run the function for both test datasets
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// GOOD LUCK
// */
// const calculateAverageHumanAge = function (ages) {
//   console.log(ages);
//   //calculating the human age of dog
//   const humanAge = ages.map(function (age) {
//     if (age <= 2) return 2 * age;
//     else return 16 + age * 4;
//   });
//   //excluding the minor adult dogs in human age
//   const adultDogs = humanAge.filter(function (age) {
//     return age >= 18;
//   });
//   console.log(adultDogs);
//   //calculating the average age of adult dogs
//   const averageAdultAge =
//     adultDogs.reduce(function (sum, age) {
//       return sum + age;
//     }, 0) / adultDogs.length;
//   console.log(averageAdultAge);
// };

// calculateAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calculateAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// //-------------CHAINING THE ARRAY METHODS --------------//
// // we can also chain array methods just like strings
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// //-------------CODING CHALLENGE 4-----------------------//
// /*
// Rewrite the 'calcAverageHumanAge' function from Challenge #2, but this time
// as an arrow function, and using chaining!
// Test data:
// § Data 1: [5, 2, 4, 1, 15, 8, 3]
// § Data 2: [16, 6, 10, 5, 6, 1, 4]
// GOOD LUCK
// */
// const calculateAverageHumanAgeArrow = function (ages) {
//   console.log(ages);
//   //calculating the human age of dog
//   const averageAdultAge = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((sum, age, _, arr) => sum + age / arr.length, 0);
//   console.log(averageAdultAge);
// };
// calculateAverageHumanAgeArrow([5, 2, 4, 1, 15, 8, 3]);
// calculateAverageHumanAgeArrow([16, 6, 10, 5, 6, 1, 4]);

// //----------------FIND () METHOD----------------//
// //retrieve first element that satisfies the condition while filter retrieves all in an array

// //finding the element that matches owner 'Jessica Davis'

// // const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// // console.log(account);

// //-----------------some() Method-----------------------//
// //checks array and returns boolean based on the condition
// //if any element satisfies the condition it returns true

// console.log(account1.movements.some(mov => mov > 0));

// //--------------Every() Method------------------------//
// //it returns true if all of the elements satisfies the condition

// console.log(account1.movements.every(mov => mov > 0));

// //-------------Flat() Method-------------------------------//
// //it converts all the nested arrays to a flat array : array containing all elements
// //it accepts the depth as parameter - depth is how deep the arrays are nested 1-level nested 2-level nested etc
// //example : level-1: [a,b,c,[a,b]] , 2-level: [a,b,v,[d,f,g,[d,f,a]]]
// const arr = ['a', 'b', 'v', 'c', 'd', ['e', ['f', 's']]];
// console.log(arr.flat(), arr.flat(2));

// //---------------FLAT the accMovements--------------------//
// const accMovements = accounts.map(mov => mov.movements).flat();
// console.log(accMovements);

// //---------flatMat()------------------------//
// //one level deep
// //takes a callback , flattens and maps the array as well

//----------------------DEFAULT SORT() METHOD----------------//

//SORTS ARRAY IN ALPHABETICAL ORDER
console.log(
  accounts
    .map(acc => acc.owner)
    .flat()
    .sort()
);
//IN CASE OF NUMBERS , SORT CONVERTS THEM TO STRINGS AND COMPARES THE FIRST LETTER AND SORT THEM
console.log(
  accounts
    .map(acc => acc.movements)
    .flat()
    .sort()
);

//TO SORT NUMBERS WE'LL USE COMPARE CALLBACK
// return true from callback function if you want to swap
//:returns two consecutive numbers as a,b when return of callback<0
//:returns two consecutive numbers as b,a when return of callback>0
console.log(
  accounts
    .map(acc => acc.movements)
    .flat()
    .sort((a, b) => {
      if (a > b) return 1;
      else return -1;
    })
);
