const gameContainer = document.querySelector("#gameContainer")
const startButton = document.querySelector("#startButton");
const scoreElement = gameContainer.querySelector("#scoreValue");
const timerElement = gameContainer.querySelector("#timerValue");
const canvas = gameContainer.querySelector("#gameBlock");
const ctx = canvas.getContext("2d");
const questionAmount = 5;
let questions = [];
let questionIndex = 0;
let score = 0;
let gameOver = false;

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawEndGameScreen = () => {
    clearCanvas();
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Finished!", canvas.width / 3, canvas.height / 2);
};

const endGame = async () => {
    gameOver = true;
    const form = gameContainer.querySelector(".submitForm");
    const buttons = form.querySelectorAll(".answerButton");
    disableButtons(buttons);
    form.removeEventListener("click", formEventListener);
    form.remove();
    drawEndGameScreen();
    startButton.disabled = false;
    score = 0;
    updateScore();
    questionIndex = 0;
    await getQuestions();
};

const countdown = () => {
    let remainingTime = 60;
    timerElement.textContent = "1:00";

    const timerInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(timerInterval);
            return;
        }

        remainingTime--;

        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        timerElement.textContent = `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;

        if (remainingTime <= 0) {
            if (!gameOver) {
                gameOver = true;
                endGame();
            }
            clearInterval(timerInterval);
        }
    }, 1000);
};

const nextQuestion = (form, index) => {
    if (questions.length > 0) {
        form.innerHTML = `
            <label class="question">${questions[index].question}</label>
            <button class="answerButton" type="submit">${questions[index].answers[0]}</button>
            <button class="answerButton" type="submit">${questions[index].answers[1]}</button>
            <button class="answerButton" type="submit">${questions[index].answers[2]}</button>
            <button class="answerButton" type="submit">${questions[index].answers[3]}</button>
        `;
    } else {
        console.warn("No questions in array");
    }
};

const drawResult = (isCorrect) => {
    clearCanvas();
    ctx.font = "40px Arial";
    if (isCorrect) {
        ctx.fillStyle = "green";
        ctx.fillText("Correct", canvas.width / 2.45, canvas.height / 2);
    } else {
        ctx.fillStyle = "red";
        ctx.fillText("Incorrect", canvas.width / 2.45, canvas.height / 2);
    }
};

const submitAnswer = async (question, answer) => {
    try {
        const response = await fetch("/submitAnswer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question, answer })
        });

        if (response.ok) {
            return await response.json();
        }
        return false;
    } catch (error) {
        console.warn(error);
        return false;
    }
};

const disableButtons = (nodes) => {
    for (const node of nodes) {
        node.disabled = true;
    }
};

const updateScore = () => {
    scoreElement.innerHTML = String(score);
};

const formEventListener = async (event) => {
    event.preventDefault();
    const form = gameContainer.querySelector(".submitForm");
    const target = event.target;

    if (target.classList.contains("answerButton")) {
        const label = form.querySelector(".question");
        const isCorrect = await submitAnswer(label.innerHTML, target.innerHTML);

        if (isCorrect) {
            score++;
            updateScore();
        }

        console.log(isCorrect);
        questionIndex++;

        if (questionIndex < questionAmount) {
            nextQuestion(form, questionIndex);
            drawResult(isCorrect);
        } else {
            endGame();
        }
    }
};

const createSubmitForm = () => {
    clearCanvas();
    const form = document.createElement("form");
    form.classList.add("submitForm");
    form.method = "POST";
    nextQuestion(form, 0);
    gameContainer.append(form);

    form.addEventListener("click", formEventListener);
};

const getQuestions = async () => {
    try {
        const response = await fetch("/getQuestions");

        if (response.ok) {
            const body = await response.json();

            if (body) {
                questions = body;
            }
        } else {
            console.warn("Failed to get questions")
        }
    } catch (error) {
        console.warn(error);
    }
};

const startGame = async () => {
    gameOver = false;
    await getQuestions();
    createSubmitForm();
    startButton.disabled = true;
    scoreElement.style.display = "block";
    countdown();
};

getQuestions();

startButton.addEventListener("click", startGame);