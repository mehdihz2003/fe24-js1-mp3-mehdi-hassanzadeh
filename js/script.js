let sessionToken;
getSessionToken()
    .then(tokenObject => {
        sessionToken = tokenObject
    })
    
let amountOfQuestions = 0;
let currentQuestionIndex = 0;
let amountCorrect = 0;
let listenersAdded = false;

const quizSettingsForm = document.querySelector('#quizSettings');
const quizQuestionDiv = document.querySelector('#questionContainer');
const answerButton = quizQuestionDiv.querySelector('#answer');
const nextButton = quizQuestionDiv.querySelector('#next');
const completedDiv = document.querySelector('#completedContainer');
const restartButton = completedDiv.querySelector('button');

quizSettingsForm.addEventListener('submit', async event => {
    event.preventDefault();

    amountOfQuestions = quizSettingsForm.querySelector('input[name="amount"]').value;
    const category = quizSettingsForm.querySelector('select[name="category"]').value;
    const difficulty = quizSettingsForm.querySelector('input[name="difficulty"]:checked').value;

    const categoryIDs = await getCategoryIDs();
    const matchingObject = categoryIDs.find(object => object.name === category);
    const matchingID = matchingObject.id;
    
    const triviaQuiz = await getTriviaQuiz(amountOfQuestions, matchingID, difficulty);
    
    quizSettingsForm.classList.add('hidden');

    createQuiz(triviaQuiz);
})

async function createQuiz(triviaQuiz) {
    renderQuiz(triviaQuiz, currentQuestionIndex);

    if (!listenersAdded) {
        answerButton.addEventListener('click', () => {
            answerFunc(triviaQuiz);
        });

        nextButton.addEventListener('click', () => {
            nextFunc(triviaQuiz);
        });

        listenersAdded = true;
    }

    quizQuestionDiv.classList.remove('hidden');
}


function renderQuiz(quiz, index) {
    const questionData = quiz[index];
    const answerOptions = shuffleArray([questionData.correct_answer, ...questionData.incorrect_answers]);

    quizQuestionDiv.querySelector('h3').innerHTML = questionData.question;

    quizQuestionDiv.querySelector('#firstOption span').innerHTML = answerOptions[0];
    quizQuestionDiv.querySelector('#firstOption input').value = answerOptions[0];

    quizQuestionDiv.querySelector('#secondOption span').innerHTML = answerOptions[1];
    quizQuestionDiv.querySelector('#secondOption input').value = answerOptions[1];

    quizQuestionDiv.querySelector('#thirdOption span').innerHTML = answerOptions[2];
    quizQuestionDiv.querySelector('#thirdOption input').value = answerOptions[2];

    quizQuestionDiv.querySelector('#fourthOption span').innerHTML = answerOptions[3];
    quizQuestionDiv.querySelector('#fourthOption input').value = answerOptions[3];
}

function answerFunc(triviaQuiz) {
    const userAnswer = quizQuestionDiv.querySelector('input[name="option"]:checked').value;
    const correctAnswer = triviaQuiz[currentQuestionIndex].correct_answer;

    if(userAnswer === correctAnswer) {
        amountCorrect++;
    }
    currentQuestionIndex++;

    const options = quizQuestionDiv.querySelectorAll('label');
    options.forEach(option => {
        const input = option.querySelector('input');
        if (input.value === correctAnswer) {
            option.style.color = 'green';
        } 
        else if (input.value === userAnswer) {
            option.style.color = 'red';
        }
    });

    answerButton.classList.add('hidden');
    nextButton.classList.remove('hidden');
}

function nextFunc(triviaQuiz) {
    const options = quizQuestionDiv.querySelectorAll('label');
    options.forEach(option => {
        option.style.color = '';
    });

    const radioInputs = quizQuestionDiv.querySelectorAll('input[name="option"]');
    radioInputs.forEach(input => {
        input.checked = false;
    });

    if(currentQuestionIndex < triviaQuiz.length) {
        renderQuiz(triviaQuiz, currentQuestionIndex);
    }
    else {
        quizQuestionDiv.classList.add('hidden');
        completedDiv.classList.remove('hidden');

        completedDiv.querySelector('#results').textContent = `You answered ${amountCorrect} questions out of ${amountOfQuestions} correct!`
    
        restartButton.addEventListener('click', () => {
            restartFunc(triviaQuiz);
        });
    }
    
    answerButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
}

function restartFunc(triviaQuiz) {
    currentQuestionIndex = 0;
    amountCorrect = 0;
    
    completedDiv.classList.add('hidden');
    quizSettingsForm.classList.remove('hidden');
}

async function getSessionToken() {
    const url = "https://opentdb.com/api_token.php?command=request";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }

        const data = await response.json();

        return data.token;
    }
    catch (error) {
        console.error("Error retrieving session token: ", error);
    }
}

async function getTriviaQuiz(amount, category, difficulty) {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple&token=${sessionToken}`;

    try {
        const response = await fetch(url);
        
        if(!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }

        const data = await response.json();

        return data.results;
    }
    catch {
        console.error("Error retrieving trivia quiz: ", error);
    }
}

async function getCategoryIDs() {
    const url = "https://opentdb.com/api_category.php";

    try {
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error (`Error! Status: ${response.status}`);
        }

        const data = await response.json();

        return data.trivia_categories;
    }
    catch {
        console.error("Error retrieving category ID: ", error);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}