import { executeShellcommand } from "./service.ts";
import { Confirm } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { terminateDB } from "./clearAllDenoKv.ts";
import { deactivateProfile } from "./activateProfile.ts";
import { shellConfigFile } from "./service.ts";

const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTODOT = `${Deno.env.get("HOME")}/.ssh/DOT`;

export async function fullReset() {
  console.log("WARNING");
  console.log(
    "Please note that this function will completely remove any changes made by this program.",
  );
  console.log("Including remove profiles and SSH keys created in it.");
  const confirmed: boolean = await Confirm.prompt(
    "Are you sure you want to continue?",
  );
  if (!confirmed) {
    console.log("Cancel reset");
    return;
  }

  deactivateProfile();
  restoreOldUserData();
  resetShellConfig();
  deleteDotFolder(PATHTODOT);
  terminateDB();
  console.log("Database cleared.");

  console.log("Full reset is done.");
}

async function restoreOldUserData() {
  const kv = await Deno.openKv();
  const user = await kv.get<string>(["OldUsername"]);
  const username = user.value ? user.value[0].trim() : "Empty";
  const email = user.value ? user.value[1].trim() : "Empty";

  kv.close();

  await executeShellcommand(`git config --global user.name ${username}`);
  await executeShellcommand(`git config --global user.email ${email}`);

  console.log("Old GIT username and email restore successfully");
}

async function resetShellConfig() {
  const shellConfig = await shellConfigFile();

  const pathToShellConfig = `${Deno.env.get("HOME")}/${shellConfig}`;

  const lineToRemove = 'export GIT_SSH_COMMAND="ssh -F ' + PATHTOGITCONFIG +
    '"';
  const fileContent = await Deno.readTextFile(pathToShellConfig);
  const lines = fileContent.split("\n");
  const newLines = lines.filter((line) => line.trim() !== lineToRemove.trim());

  if (lines.length === newLines.length) {
    console.log("The specified line was not found in the file.");
    return;
  }

  const newContent = newLines.join("\n");
  await Deno.writeTextFile(pathToShellConfig, newContent);
  console.log("Shell config restore successfully");
}

async function deleteDotFolder(folderPath: string): Promise<void> {
  await Deno.remove(folderPath, { recursive: true });
  console.log("DOT folder deleted successfully");
}
