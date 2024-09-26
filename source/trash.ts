import { shelly, zsh, bash, sh } from "@vseplet/shelly";
import { ensureFile } from "https://deno.land/std/fs/mod.ts";
import { checShell, shellConfigFile } from "./commands/service.ts";
import { executeShellcommand } from "./commands/service.ts";



// test()

async function createBackupUserData() {
  const currentUsername = await executeShellcommand("git config --global user.name");
  const currentEmail = await executeShellcommand("git config --global user.email");

console.log(currentUsername, currentEmail)

  // const kv = await Deno.openKv();

  // await kv.set(["OldUsername"], [currentUsername.stdout, currentEmail.stdout]);

  // kv.close();
}

createBackupUserData()
