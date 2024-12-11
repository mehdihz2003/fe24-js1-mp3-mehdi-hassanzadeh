let sessionToken;
getSessionToken()
    .then(tokenObject => {
        sessionToken = tokenObject
    })

    getCategoryID();

const quizSettingsForm = document.querySelector('#quizSettings');
const quizQuestionDiv = document.querySelector('#questionContainer');

quizSettingsForm.addEventListener('submit', async event => {
    event.preventDefault();

    const amount = quizSettingsForm.querySelector('input[name="amount"]').value;
    const category = quizSettingsForm.querySelector('select[name="category"]').value;
    const difficulty = quizSettingsForm.querySelector('input[name="difficulty"]:checked').value;

    const categoryIDs = await getCategoryID();

    const matchingObject = categoryIDs.find(item => item.name === category);
    let matchingID;

    if(matchingObject) {
        matchingID = matchingObject.id;
        console.log(matchingID);
    }

    const triviaQuiz = await getTriviaQuiz(amount, matchingID, difficulty);
    console.log(triviaQuiz);
    quizSettingsForm.classList.add('hidden');
    quizQuestionDiv.classList.remove('hidden');
})

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
        console.error("Error retrieving trivia quiz: ");
    }
}

async function getCategoryID() {
    const url = "https://opentdb.com/api_category.php";

    try {
        const response = await fetch(url);

        if(!response.ok) {
            throw new Error (`Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        return data.trivia_categories;
    }
    catch {
        console.error("Error retrieving category ID: ", error);
    }
}