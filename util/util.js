// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

// https://sebhastian.com/shuffle-array-javascript/
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

module.exports = { getRandomInt, shuffleArray, };