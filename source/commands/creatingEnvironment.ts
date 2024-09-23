import { ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { zsh } from "@vseplet/shelly";

const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTODOT = `${Deno.env.get("HOME")}/.ssh/DOT/`;

// Сделать вариантативность и чекать какой шелл.
const PATHTOSHELLCONFIG = `${Deno.env.get("HOME")}/.zshrc`;

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
    await createEnvironment();
    await shellSetup();
    await zsh('export GIT_SSH_COMMAND="ssh -F ' + PATHTOGITCONFIG + '"');
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

async function shellSetup() {
  const shellUpdateLine = 'export GIT_SSH_COMMAND="ssh -F ' + PATHTOGITCONFIG +
    '"';
  await ensureFile(PATHTOSHELLCONFIG);
  const file = await Deno.open(PATHTOSHELLCONFIG, {
    write: true,
    append: true,
  });
  const encoder = new TextEncoder();
  await file.write(encoder.encode("\n" + shellUpdateLine));
  file.close();
}

