import { Command } from "../deps.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
// import { readLines } from "https://deno.land/std/io/mod.ts"
// Почему то через аналогичный с Command испорт делать не хочет 
import {readGitConfigFile} from "../source/commands/readGitConfigFile.ts"
import {getUserInput, createNewProfile, getProfileList} from "../source/commands/profileManager.ts"

const PATHTOGITCONFIG = "/Users/jegnum/.ssh/config"

async function displayMenu() {
  const result = await Select.prompt({
    message: "Choose an option:",
    options: [
      { name: "Hello", value: "1" },
      { name: "Status", value: "2" },
      { name: "List all users", value: "3" },
      { name: "Exit", value: "10" },
    ],
  });

  switch (result) {
    case "1":
      console.log("and hello to you");
      break;
    case "2":
      readGitConfigFile(`${PATHTOGITCONFIG}`)
      console.log("clarifying");
      break;
    case "3":
      getProfileList()
      break;
    case "10":
      Deno.exit(1)
      break;  
    default:
      console.log("Invalid option");
  }
}

async function main() {
  while (true) {
    await displayMenu();
    console.log("\n");
  }
}

main();


/* 
await new Command()
  .name("cliffy")
  .version("0.1.0")
  .description("Command line framework for Deno")
  .parse(Deno.args);
  */