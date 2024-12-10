let sessionToken;
getSessionToken()
    .then(tokenObject => {
        sessionToken = tokenObject
    })

let categoryIDs;
getCategoryID()
    .then(categoryObject => {
        categoryIDs = categoryObject;
    })

const quizSettingsForm = document.querySelector('#quizSettings');

quizSettingsForm.addEventListener('submit', async event => {
    event.preventDefault();

    const amount = quizSettingsForm.querySelector('input[name="amount"]').value;
    console.log(amount);

    const category = quizSettingsForm.querySelector('select').value;
    console.log(category);

    const difficulty = quizSettingsForm.querySelector('input[name="difficulty"]:checked').value;
    console.log(difficulty);

    const matchingObject = categoryIDs.find(item => item.name === category);
    let matchingID;

    if(matchingObject) {
        matchingID = matchingObject.id;
        console.log(matchingID);
    }

    const triviaQuiz = await getTriviaQuiz(amount, matchingID, difficulty);
    console.log(triviaQuiz);
    quizSettingsForm.remove();
})

async function getSessionToken() {
    const url = "https://opentdb.com/api_token.php?command=request";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Session Token:", data.token);

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

        //console.log(data);

        return data.results;
    }
    catch {
        console.error("Error retrieving trivia quiz: ", error);
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

        //console.log(data);

        return data.trivia_categories;
    }
    catch {
        console.error("Error retrieving category ID: ", error);
    }
    
}