// expected output: 5
const input1 = [3, 2, 1, 5, 6, 4];
const k1 = 2

// expected output 4
const input2 = [3, 2, 3, 1, 2, 4, 5, 5, 6]
const k2 = 4

// Note: you may assume k is always valid, 1 <= k <= arrays's length
function kthLargestElement (array, number)  {
  let distinctArr = array.filter((ele, index, ) => {
    return ele.indexOf(value) === index;
  })
  return distinctArr[distinctArr.length - 1];
}
const arguments = [9,3,6];
console.log("The average of " + arguments + " is " + arguments.reduce( ( p, c ) => p + c, 0 ) / arguments.length);
const wordChoice = 'word'


let random = ['0','1','2','3','4','5','6','7','8','9']
console.log('what splice 0 - length: ', random.slice(0, random.length));
let randomIndex = []
let randomValues = []
let res
randomIndexValue =  Math.floor(Math.random() * wordChoice.length);
randomValue = Math.floor(Math.random() * random.length);
randomIndex.push(randomIndexValue)
randomValues.push(randomValue)

for(i = 0; i < wordChoice.length; i++){


  for(j = 0; j < random.length; j ++ ){

    res = wordChoice.replace(wordChoice[randomIndex], random[randomValues]);

  }

}
console.log(res);
