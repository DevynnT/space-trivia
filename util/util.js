const getQuestions = async () => {
    const response = await fetch('https://the-trivia-api.com/api/questions?limit=20&tags=space,space_exploration,the_space_race', {
        headers: {
          // 'x-api-key': <LinkPI_KEY>,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const body = await response.json();
        return body;
      }

      return false;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

// https://sebhastian.com/shuffle-array-javascript/
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

module.exports = { getQuestions, getRandomInt, shuffleArray, };