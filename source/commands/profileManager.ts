import { selectUserCore } from "./selectCore.ts";
import {
  deleteSelectedKvObject,
  disconnectSshKeyAndUser,
  getUserInput,
} from "./service.ts";
import { checkIsThisUserActive } from "./activateProfile.ts";

export async function createNewProfile() {
  const name = await getUserInput("Please enter a name:");
  const email = await getUserInput("Please enter a email:");
  const ssh = "Empty";
  const kv = await Deno.openKv();

  await kv.set(["userName:", name], ["connectedSSH", ssh, "Email:", email]);

  console.log(`User ${name} saved successfully`);

  kv.close();
}

export async function getProfileList(): Promise<Array<Deno.KvEntry<string>>> {
  const kv = await Deno.openKv();

  const iter = kv.list<string>({ prefix: ["userName:"] });
  const users = [];

  for await (const res of iter) users.push(res);

  kv.close();

  return users;
}

export async function chooseProfile() {
  const data = await getProfileList();
  const result = await selectUserCore(data);
  if (result !== undefined) {
    const name = result?.[0] ?? "Unknown";
    const email = result?.[2] ?? "Unknown";
    const connectedSSH = result?.[1] ?? "Unknown";

    console.log(
      "Name:",
      name,
      "|",
      "Email:",
      email,
      "|",
      "connectedSSH:",
      connectedSSH,
    );
  } else {
    console.log("No data found.");
  }
}

export async function deleteProfile() {
  const data = await getProfileList();
  const result = await selectUserCore(data);
  const name = result?.[0] ?? "Unknown";
  console.log(name)
  const connectedSSH = result?.[1] ?? "Unknown";

  if (await checkIsThisUserActive(name)) {
    console.log("You can't delete active user. Deactivate profile first.");
    return;
  } 

  if (result !== undefined) {
    if (connectedSSH !== "Empty") {
      await disconnectSshKeyAndUser(name, connectedSSH);
      await deleteSelectedKvObject("userName:", name);
      console.log(`User ${name} deleted successfully`);
    } else {
      await deleteSelectedKvObject("userName:", name);
      console.log(`User ${name} deleted successfully`);
    }
  } else {
    console.log("No data found.");
  }
}

// createNewProfile();

// getProfileList()
// chooseProfile()
