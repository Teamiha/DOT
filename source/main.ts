// import { Command } from "../deps.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { manualDisconnectSshKeyAndUser } from "./commands/service.ts";
import {
  chooseUser,
  createNewUser,
  deleteUser,
} from "./commands/userManager.ts";
import {
  choseSshKey,
  createNewSshKey,
  deleteSshKey,
} from "./commands/sshKeyManager.ts";
import { confirmTermination } from "../source/commands/clearAllDenoKv.ts";
import { connectUserToSsh } from "../source/commands/connectUserAndSshKey.ts";
import {
  activateProfile,
  showActiveProfileStatus,
} from "./commands/activateProfile.ts";
import { gitClone } from "./commands/gitManager.ts";
import { about } from "./commands/about.ts";

async function displayManagerMenu() {
  const result = await Select.prompt({
    message: "Choose an option:",
    options: [
      { name: "Create new User", value: "1" },
      { name: "Create new SSH key", value: "2" },
      { name: "Connect User to SSH key", value: "3" },
      { name: "Disconnect User to SSH key", value: "4" },
      { name: "Delete SSH key", value: "5" },
      { name: "Delete User", value: "6" },
      { name: "Return", value: "7" },
    ],
  })
  switch (result) {
    case "1":
      await createNewUser();
      break;
    case "2":
      await createNewSshKey();
      break;
    case "3":
      await connectUserToSsh();
      break;
    case "4":
      await manualDisconnectSshKeyAndUser();
      break;
    case "5":
      await deleteSshKey();
      break;
    case "6":
      await deleteUser();
      break;
    case "7":
      break;
    default:
      console.log("Invalid option");
  }
}

async function displayMenu() {
  const result = await Select.prompt({
    message: "Choose an option:",
    options: [
      { name: "Git clone", value: "1" },
      { name: "Activate Profile", value: "2" },
      { name: "User and SSH Manager", value: "3" },
      { name: "Status", value: "4" },
      { name: "List all Users", value: "5" },
      { name: "List all SSH keys", value: "6" },
      { name: "Terminate all DataBase", value: "7" },
      { name: "About", value: "8" },
      { name: "Exit", value: "10" },
    ],
  });

  switch (result) {
    case "1":
      await gitClone();
      break;
    case "2":
      await activateProfile();
      break;
    case "3":
      await displayManagerMenu();
      break;
    case "4":
      await showActiveProfileStatus(false);
      break;
    case "5":
      await chooseUser(true);
      break;
    case "6":
      await choseSshKey(true);
      break;
    case "7":
      await confirmTermination();
      break;  
    case "8":
      about();
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
