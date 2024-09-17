import { zsh } from "@vseplet/shelly";
import { selectSshKeyCore } from "./selectCore.ts";
import {
  deleteSelectedKvObject,
  disconnectSshKeyAndUser,
  getUserInput,
} from "./service.ts";
import { Confirm } from "https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/confirm.ts";
import { checkIsThisActive } from "./service.ts";

export async function createNewSshKey() {
  const kv = await Deno.openKv();

  const name = await getUserInput("Enter a name for the SSH key:");
  const email = await getUserInput("Enter your email:");
  const ssh = await zsh(`ssh-keygen -t ed25519 -C ${email} -f ~/.ssh/${name}`);
  const connectedUser = "Empty";

  if (ssh.success === true) {
    console.log("SSH key generated successfully");
    await kv.set(["sshKeyName:", name], ["connectedUser", connectedUser]);
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

export async function choseSshKey(showDataInConsole: boolean) {
  const sshKeys = await getAllSshKeysList();
  const result = await selectSshKeyCore(sshKeys);
  if (result !== undefined) {
    const name = result?.[0] ?? "Unknown";
    const conection = result?.[1] ?? "Unknown";
    if (showDataInConsole === true) {
    console.log("Name:", name, "|", "Conection user:", conection);
    } else {
      return [name, conection]
    }
  } else {
    console.log("No data found.");
  }
}

export async function deleteSshKey() {
  const sshKey = await getAllSshKeysList();
  if (sshKey.length === 0) {
    console.log("No data found.");
  } else {
    const result = await selectSshKeyCore(sshKey);

    const keyName = result?.[0] ?? "Unknown";
    const connectedUser = result?.[1] ?? "Unknown";
    const pathToDelete = `${Deno.env.get("HOME")}/.ssh/${keyName}`;
    const pathToDeletePubKey = `${Deno.env.get("HOME")}/.ssh/${keyName}.pub`;

    if (await checkIsThisActive(keyName)) {
      console.log("You can't delete active key. Deactivate profile first.");
      return;
    }

    if (connectedUser !== "Empty") {
      console.log(
        `This key is connected to a user ${connectedUser}, are you sure you want to delete it?`,
      );
      const confirmed: boolean = await Confirm.prompt("Can you confirm?");
      if (confirmed) {
        await disconnectSshKeyAndUser(connectedUser, keyName);
        await deleteSelectedKvObject("sshKeyName:", keyName);
        await Deno.remove(pathToDelete);
        await Deno.remove(pathToDeletePubKey);
        console.log(`Key ${keyName} deleted successfully`);
      } else {
        console.log("Key deletion canceled");
      }
    } else {
      await deleteSelectedKvObject("sshKeyName:", keyName);
      await Deno.remove(pathToDelete);
      await Deno.remove(pathToDeletePubKey);
      console.log(`Key ${keyName} deleted successfully`);
    }
  }
}

// createNewSshKey();
// getAllSshKeysList();
// selectSshKey()
// deleteSshKey()
