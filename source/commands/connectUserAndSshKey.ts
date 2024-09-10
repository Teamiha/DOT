import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { getProfileList } from "./profileManager.ts";
import { getAllSshKeysList } from "./sshKeyGen.ts";
import { selectUserCore, selectSshKeyCore } from "./selectCore.ts";

async function keyRecording(user: string, sshKey: string) {
  const kv = await Deno.openKv();
  // const existingUser = await kv.get(["Name:", user]);

  await kv.set(["userName:", user], ["connectedSSH", sshKey]);
  await kv.set(["keyName:", sshKey], ["connectionUser:", user]);

  console.log(`User ${user} connected to SSH key ${sshKey}`);

  kv.close();
}

export async function connectUserToSsh() {
  const userList = await getProfileList();
  const sshList = await getAllSshKeysList();

  await selectUserCore(userList, (name, ssh, email) => {
    const nameTest = name;
  });

    console.log(`SSH key: ${nameKey}`);
    console.log(`You selected: ${name}`);
    console.log(`SSH value: ${ssh}`);
    console.log(`You selected ssh key: ${nameKey}`);

    await keyRecording(name, nameKey);
   else {
    console.log("No users found.");
  }
}

  connectUserToSsh();
