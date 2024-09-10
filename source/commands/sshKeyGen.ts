import { readLines } from "https://deno.land/std/io/mod.ts";
import { shelly, zsh } from "@vseplet/shelly";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { selectSshKeyCore } from "./selectCore.ts";
import { getUserInput } from "./service.ts";


export async function createNewSshKey() {
  const kv = await Deno.openKv();

  const name = await getUserInput("Enter a name for the SSH key:");
  const email = await getUserInput("Enter your email:");
  const ssh = await zsh(`ssh-keygen -t ed25519 -C ${email} -f ~/.ssh/${name}`);
  const connectedUser = "Empty";

  if (ssh.success === true) {
    console.log("SSH key generated successfully");
    const sshKeyAdress = `${Deno.env.get("HOME")}/.ssh/${name}`;
    await kv.set(["sshKeyName:", name, "keyAdress", sshKeyAdress], ["connectedUser", connectedUser]);
  } else {
    console.log("Error: SSH key generation failed");
  }
  kv.close();
}

export async function getAllSshKeysList(): Promise<
  Array<Deno.KvEntry<string>>
> {
  const kv = await Deno.openKv();
  const iter = await kv.list<string>({ prefix: ["sshKeyName:"] });
  const keys = [];

  for await (const res of iter) keys.push(res);

  kv.close();
  return keys;
}


export async function selectSshKey() {
  const sshKeys = await getAllSshKeysList();
  const result = await selectSshKeyCore(sshKeys);

  const name = result?.[0] ?? "Unknown";
  const keyAdress = result?.[1] ?? "Unknown";
  const conection = result?.[2] ?? "Unknown";

  console.log("Name:", name, "|", "Key adress:", keyAdress, "|", "Conection user:", conection);
}



// createNewSshKey();
// getAllSshKeysList();
// selectSshKey()
