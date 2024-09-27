import { bash, sh, shelly, zsh } from "@vseplet/shelly";
import { ensureFile } from "https://deno.land/std/fs/mod.ts";
import { checShell, shellConfigFile } from "./commands/service.ts";
import { executeShellcommand } from "./commands/service.ts";

// test()
const selectedUserName = "Mikhail_Svetlov"
const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;

async function test() {
  // await shelly(["git", "config", "--global", "--replace-all", "user.name", `${selectedUserName}`]);
  // const rez = await shelly(["git", "config", "--global", "user.name"])
  // console.log(rez.stdout);
  // await shelly(["export", `GIT_SSH_COMMAND="ssh -F ' + ${PATHTOGITCONFIG}"`]);
}



test();
