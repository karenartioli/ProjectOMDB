const { prompt } = require("enquirer");
const { Pool } = require("pg");

console.log("Hello, lovely user!");

function makeDBConnectionPool(dbName) {
    return new Pool({
        database: dbName,
    });
}
module.exports = { makeDBConnectionPool };
const pool = makeDBConnectionPool("omdb");

async function getUserInput() {
    const response = await prompt({
        type: "input",
        name: "inputString",
        message: "Please input search team (or 'q' to quit): ",
    });
    return response.inputString;
}

async function getMoviesWithInputString(inputString) {
    const query =
        `
        SELECT DISTINCT movie_id, movie_name, date, runtime, budget, revenue, vote_average, votes_count
        FROM casts_view
        WHERE movie_name ILIKE '%${inputString}%' AND kind = 'movie'
        ORDER BY date DESC
        LIMIT 10;
        `;

    const promiseOfDBResult = pool.query(query);
    return promiseOfDBResult;
}

function printMoviesTable(promiseOfDBResult) {
    console.table(promiseOfDBResult.rows);
}

async function main() {
    let inputString = await getUserInput();
    while (inputString !== "q") {
        const filteredMovies = await getMoviesWithInputString(inputString);
        printMoviesTable(filteredMovies);
        inputString = await getUserInput();
    }
    console.log("Thank you for using this amazing search tool that I poundly created!");
}

main();