// import { Command } from "../deps.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { readGitConfigFile } from "./commands/service.ts";
import {
  chooseProfile,
  createNewProfile,
} from "../source/commands/profileManager.ts";
import {
  createNewSshKey,
  deleteSshKey,
  selectSshKey,
} from "../source/commands/sshKeyGen.ts";
import { confirmTermination } from "../source/commands/clearAllDenoKv.ts";
import { connectUserToSsh } from "../source/commands/connectUserAndSshKey.ts";

// const USERNAME = Deno.env.get("USER");
const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/config`;

async function displayMenu() {
  const result = await Select.prompt({
    message: "Choose an option:",
    options: [
      { name: "Create new profile", value: "1" },
      { name: "Status", value: "2" },
      { name: "Create new SSH key", value: "3" },
      { name: "List all Users", value: "4" },
      { name: "List all SSH keys", value: "5" },
      { name: "Connect User to SSH key", value: "6" },
      { name: "Delete SSH key", value: "7" },
      { name: "Terminate all DataBase", value: "9" },
      { name: "Exit", value: "10" },
    ],
  });

  switch (result) {
    case "1":
      await createNewProfile();
      break;
    case "2":
      readGitConfigFile(`${PATHTOGITCONFIG}`);
      break;
    case "3":
      await createNewSshKey();
      break;
    case "4":
      await chooseProfile();
      break;
    case "5":
      await selectSshKey();
      break;
    case "6":
      await connectUserToSsh();
      break;
    case "7":
      await deleteSshKey();
      break;
    case "9":
      await confirmTermination();
      break;
    case "10":
      Deno.exit(0);
      break;
    default:
      console.log("Invalid option");
  }
}

async function main() {
  while (true) {
    await displayMenu();
    console.log("----------------------------------------");
  }
}

main();
