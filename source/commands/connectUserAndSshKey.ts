import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { getProfileList } from "./profileManager.ts";
import { getAllSshKeysList } from "./sshKeyGen.ts";
import { selectUserCore, selectSshKeyCore } from "./selectCore.ts";

async function keyRecording(user: string, sshKey: string, email: string) {
  const kv = await Deno.openKv();

  await kv.set(["userName:", user], ["connectedSSH", sshKey, "Email:", email]);
  await kv.set(["sshKeyName:", sshKey], ["connectedUser", user]);

  console.log(`User ${user} connected to SSH key ${sshKey}`);

  kv.close();
}

export async function connectUserToSsh() {
  const userList = await getProfileList();
  const sshList = await getAllSshKeysList();

  const userListResult = await selectUserCore(userList)

  const name = userListResult?.[0] ?? "Unknown";
  const email = userListResult?.[2] ?? "Unknown";
  const connectedSSH = userListResult?.[1] ?? "Unknown";
  console.log("User: ", name, "|", "Email: ", email, "|", "Connected SSH: ", connectedSSH);

  const sshListResult = await selectSshKeyCore(sshList)

  const nameKey = sshListResult?.[0] ?? "Unknown";
  const conectionUser = sshListResult?.[1] ?? "Unknown";

  console.log("SSH key: ", nameKey, "|", "Connection user: ", conectionUser);

    // console.log(`SSH key: ${nameKey}`);
    // console.log(`You selected: ${name}`);
    // console.log(`You selected ssh key: ${nameKey}`);

    // await keyRecording(name, nameKey, email);
  
   
  
}

  connectUserToSsh();
