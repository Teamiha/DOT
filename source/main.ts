// import { Command } from "../deps.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { disconnectSshKeyAndUser } from "./commands/service.ts";
import {
  chooseUser,
  createNewUser,
  deleteUser,
} from "./commands/userManager.ts";
import {
  createNewSshKey,
  deleteSshKey,
  selectSshKey,
} from "../source/commands/sshKeyGen.ts";
import { confirmTermination } from "../source/commands/clearAllDenoKv.ts";
import { connectUserToSsh } from "../source/commands/connectUserAndSshKey.ts";
import { showActiveProfileStatus, activateProfile, deactivateProfile } from "./commands/activateProfile.ts";

// const USERNAME = Deno.env.get("USER");
const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/config`;

async function displayMenu() {
  const result = await Select.prompt({
    message: "Choose an option:",
    options: [
      { name: "Activate Profile", value: "1" },
      { name: "Deactivate Profile", value: "2" },
      { name: "Status", value: "3" },
      { name: "Create new User", value: "4" },
      { name: "Create new SSH key", value: "5" },
      { name: "Connect User to SSH key", value: "6" },
      { name: "List all Users", value: "7" },
      { name: "List all SSH keys", value: "8" },
      { name: "Delete SSH key", value: "9" },
      { name: "Delete User", value: "10" },
      { name: "Terminate all DataBase", value: "20" },
      { name: "Exit", value: "30" },
    ],
  });

  switch (result) {
    case "1":
      await activateProfile();
      break;
    case "2":
      deactivateProfile();
      break;
    case "3":
      await showActiveProfileStatus();
      break;
    case "4":
      await createNewUser();
      break;
    case "5":
      await createNewSshKey();
      break;
    case "6":
      await connectUserToSsh();
      break;
    case "7":
      await chooseUser();
      break;
    case "8":
      await selectSshKey();
      break;
    case "9":
      await deleteSshKey();
      break;
    case "10":
      await deleteUser();
      break;
    case "20":
      await confirmTermination();
      break;
    case "30":
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
