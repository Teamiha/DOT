import { ensureFile } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { boolean } from "jsr:@cliffy/flags@1.0.0-rc.5";

const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTODOT = `${Deno.env.get("HOME")}/.ssh/DOT/`;

const configName = "config";

const initialConfigFilling = `Host test
HostName github.com
User git
AddKeysToAgent yes
UseKeychain yes
IdentityFile empty
IdentitiesOnly yes
UserKnownHostsFile ${PATHTODOT}known_hosts`
;

export async function startupSetup() {
    const status = await checkIfDotFolderExist()
    if (status === true) {
        console.log("The directory already exists")
    } else {
        await createEnvironment();
        console.log("Initial setup completed successfully")
    }
}


export async function checkIfDotFolderExist(): Promise<boolean> {
  let isExist = false
  try {
    const dirInfo = await Deno.stat(PATHTODOT);
    if (dirInfo.isDirectory) {
    //   console.log(`Directory already exists.`);
      isExist = true
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
    //   console.log(`Directory dont exists.`);
      isExist = false
    }
  }
  return isExist
}

async function createEnvironment() {
  await Deno.mkdir(PATHTODOT, { recursive: true });
  console.log(`Created directory ${PATHTODOT}.`);

  await ensureFile(PATHTOGITCONFIG);
  await Deno.writeTextFile(PATHTOGITCONFIG, initialConfigFilling);
  console.log(`Wrote config text to ${PATHTOGITCONFIG}`);

  const content = await Deno.readTextFile(PATHTOGITCONFIG);
  console.log("File contents:");
  console.log(content);
}


async function test(){
    const rez = await checkIfDotFolderExist()
    console.log(rez)
}

// test()

// startupSetup()