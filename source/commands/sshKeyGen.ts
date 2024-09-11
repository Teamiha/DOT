import { readLines } from "https://deno.land/std/io/mod.ts";
import { shelly, zsh } from "@vseplet/shelly";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { selectSshKeyCore } from "./selectCore.ts";
import { getUserInput } from "./service.ts";
import { Confirm } from "https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/confirm.ts";


export async function createNewSshKey() {
  const kv = await Deno.openKv();

  const name = await getUserInput("Enter a name for the SSH key:");
  const email = await getUserInput("Enter your email:");
  const ssh = await zsh(`ssh-keygen -t ed25519 -C ${email} -f ~/.ssh/${name}`);
  const connectedUser = "Empty";


  // Возможно адрес лишний? 

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

export async function deleteSshKey() {
    const sshKey = await getAllSshKeysList();
    const result = await selectSshKeyCore(sshKey);
    const keyName = result?.[0] ?? "Unknown";
    const connectedUser = result?.[2] ?? "Unknown";
    console.log(keyName)

    if(connectedUser !== "Empty") {
      console.log(`This key is connected to a user ${connectedUser}, are you sure you want to delete it?`)
      const confirmed: boolean = await Confirm.prompt("Can you confirm?");
      if(confirmed) {




        const pathToDelete = `${Deno.env.get("HOME")}/.ssh/${keyName}`
        const pathToDeletePubKey = `${Deno.env.get("HOME")}/.ssh/${keyName}.pub`

        console.log(pathToDelete)
        console.log(pathToDeletePubKey)
        // await Deno.remove(pathToDelete)
        // await Deno.remove(pathToDeletePubKey)
        console.log(`Key ${keyName} deleted successfully`)
      } else {
        console.log("Key deletion canceled")
        return
      }
    }

    

  }




// createNewSshKey();
// getAllSshKeysList();
// selectSshKey()
// deleteSshKey()
