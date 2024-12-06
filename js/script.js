const sessionToken = getSessionToken();

async function getSessionToken() {
    const url = "https://opentdb.com/api_token.php?command=request";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }

        const data = await response.json();

        const sessionToken = data.token;

        console.log("Session Token:", sessionToken);

        return sessionToken;
    }
    catch (error) {
        console.error("Error retrieving session token:", error);
    }
}