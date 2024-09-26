import { ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { executeShellcommand } from "./service.ts";
import { shellConfigFile } from "./service.ts";

const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTODOT = `${Deno.env.get("HOME")}/.ssh/DOT/`;


const initialConfigFilling = `Host default
HostName github.com
User git
AddKeysToAgent yes
UseKeychain yes
IdentityFile empty
IdentitiesOnly yes
UserKnownHostsFile ${PATHTODOT}known_hosts`;

export async function startupSetup() {
  const status = await checkIfDotFolderExist();
  if (status === true) {
    return;
  } else {
    await createBackupUserData();
    await createEnvironment();
    await shellSetup();
    await executeShellcommand('export GIT_SSH_COMMAND="ssh -F ' + PATHTOGITCONFIG + '"');
    console.log("Initial setup completed successfully");
  }
}

export async function checkIfDotFolderExist(): Promise<boolean> {
  let isExist = false;
  try {
    const dirInfo = await Deno.stat(PATHTODOT);
    if (dirInfo.isDirectory) {
      isExist = true;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      isExist = false;
    }
  }
  return isExist;
}

async function createEnvironment() {
  await Deno.mkdir(PATHTODOT, { recursive: true });

  await ensureFile(PATHTOGITCONFIG);

  await ensureFile(`${PATHTODOT}known_hosts`);
  await Deno.writeTextFile(PATHTOGITCONFIG, initialConfigFilling);
}

async function createBackupUserData() {
  const currentUsername = await executeShellcommand("git config --global user.name");
  const currentEmail = await executeShellcommand("git config --global user.email");

  const kv = await Deno.openKv();

  await kv.set(["OldUsername"], [currentUsername.stdout, currentEmail.stdout]);

  kv.close();
}

async function shellSetup() {
  const shellConfig = await shellConfigFile();

  const pathToShellConfig = `${Deno.env.get("HOME")}/${shellConfig}`; 


  const shellUpdateLine = 'export GIT_SSH_COMMAND="ssh -F ' + PATHTOGITCONFIG +
    '"';
  await ensureFile(pathToShellConfig);
  const file = await Deno.open(pathToShellConfig, {
    write: true,
    append: true,
  });
  const encoder = new TextEncoder();
  await file.write(encoder.encode("\n" + shellUpdateLine));
  file.close();
}
