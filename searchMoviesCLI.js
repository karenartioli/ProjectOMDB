const { question } = require("readline-sync");
const { Client } = require("pg");

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ database: "omdb" });

//alternative:
//const client = new Client({ connectionString: "postgres://academy@localhost/omdb", });

async function main() {
  console.log("Welcome to search-movies-cli!");
  await client.connect();
  console.log("client has connected to db server");
  const dbResult = await client.query("select * from movies limit 10");
  for (const row of dbResult.rows) {
    console.log(row.name);
  }
  client.end();
}

main();
