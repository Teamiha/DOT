import { ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";
// import * as path from "https://deno.land/std@0.224.0/path/mod.ts";
// import { boolean } from "jsr:@cliffy/flags@1.0.0-rc.5";
import { zsh } from "@vseplet/shelly";

const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTODOT = `${Deno.env.get("HOME")}/.ssh/DOT/`;

// Сделать вариантативность и чекать какой шелл.
const PATHTOSHELLCONFIG = `${Deno.env.get("HOME")}/.zshrc`;

const initialConfigFilling = `Host test
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
    // console.log("The directory already exists");
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
      //   console.log(`Directory already exists.`);
      isExist = true;
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      //   console.log(`Directory dont exists.`);
      isExist = false;
    }
  }
  return isExist;
}

async function createEnvironment() {
  await Deno.mkdir(PATHTODOT, { recursive: true });
  //   console.log(`Created directory ${PATHTODOT}.`);

  await ensureFile(PATHTOGITCONFIG);
  // Сделать по красоте
  await ensureFile(`${PATHTODOT}known_hosts`);
  await Deno.writeTextFile(PATHTOGITCONFIG, initialConfigFilling);
  //   console.log(`Wrote config text to ${PATHTOGITCONFIG}`);

  //   const content = await Deno.readTextFile(PATHTOGITCONFIG);
  //   console.log("File contents:");
  //   console.log(content);
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

// async function test(){
//     const rez = await checkIfDotFolderExist()
//     console.log(rez)
// }

// test()
