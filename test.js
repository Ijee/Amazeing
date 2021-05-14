let accounts = [[1, 2, 3], [3, 2, 1]];

let maximumWealth = function (accounts) {
  const accumulatedWealth = [];
  accounts.map(customer => {
    accumulatedWealth.push(customer.reduce((a, b) => a + b, 0))
  });
  return Math.max(...accumulatedWealth);
};

var maximumWealth2 = function (accounts) {
  let highestWealth = 0;
  accounts.map(customer => {
    const newWealth = customer.reduce((a, b) => a + b, 0)
    highestWealth > newWealth ? highestWealth : newWealth;
  });
  return highestWealth;
};

console.log(maximumWealth(accounts));
console.log(maximumWealth(accounts));

function subtractProductAndSum(n) {
  let arr = n.toString().split('');
  console.log(arr);
  const product = arr.reduce((a, b) => a * b);
  const sum = arr.reduce((a, b) => a + b);
  return product - sum;
};

console.log('subtractProductAndSum', subtractProductAndSum(123));


function maximum69Number (num) {
  const numStr = num.toString();
  for (let i = 0; i < numStr.length; i++) {
    if (numStr.charAt(i) === '6') {
      return numStr.slice(0, i) + '9' + numStr.slice(i + 1);
    }
  }
};

console.log('maximum69Number', maximum69Number(6969));

function sumOddLengthSubarrays(arr) {
  let output = 0;
  for (let i = 0; i <= arr.length; i++) {
    for (let j = 0; j <= arr.length; j++) {
      let tempArr = arr.slice(i, j);
      console.log(tempArr);
      if (tempArr.length % 2 === 1) {

        output += tempArr.reduce((a, b) => a + b, 0);
      }
    }
  }
  return output
};

console.log('sumOddLengthSubarrays', sumOddLengthSubarrays([1,4,2,5,3]));
