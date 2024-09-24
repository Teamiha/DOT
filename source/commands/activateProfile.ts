import { readGitConfigFile } from "./service.ts";
import { chooseUser } from "./userManager.ts";
import { zsh } from "@vseplet/shelly";
import { startupSetup } from "./creatingEnvironment.ts";

const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTOSSHKEYS = `${Deno.env.get("HOME")}/.ssh/DOT/`;

async function setActiveProfile(username: string, sshKey: string) {
  const kv = await Deno.openKv();
  await kv.set(["activeProfile"], [username]);
  await kv.set(["activeSSHKey"], [sshKey]);
  kv.close();
}

function stringifySSHConfig(
  config: { key: string; value: string }[] | undefined,
): string {
  if (config === undefined) {
    return "";
  }
  return config.map((entry) => `${entry.key} ${entry.value}`).join("\n");
}

// Функция универсальна. При необходимости может менять любой пункт активного профиля.
async function changeSSHConfig(key: string, newValue: string) {
  const rawData = await readGitConfigFile(PATHTOGITCONFIG);

  if (rawData !== undefined) {
    const entry = rawData.find((entry) => entry.key === key);
    if (entry) {
      entry.value = newValue;
      const convertResult = stringifySSHConfig(rawData);
      await Deno.writeTextFile(PATHTOGITCONFIG, convertResult);
      return { success: true };
    } else {
      console.error(`Key "${key}" not found in the config.`);
      return { success: false };
    }
  } else {
    console.log("Error getting config");
  }
}

export async function activateProfile() {
  const selectedUser = await chooseUser(false);
  const selectedUserName = selectedUser?.name ?? "Empty";

  console.log(selectedUserName);

  const selectedUserSSHKey = selectedUser?.connectedSSH ?? "Empty";
  const selectedUserEmail = selectedUser?.email ?? "Empty";

  await startupSetup();

  if (selectedUser !== undefined) {
    if (selectedUserSSHKey === "Empty") {
      console.log("This user does not have an SSH key attached.");
    } else {
      const newKey = await changeSSHConfig(
        "IdentityFile",
        `${PATHTOSSHKEYS}${selectedUserSSHKey}`,
      ) || { success: false };
      if (newKey.success === true) {
        await zsh(
          `git config --global --replace-all user.name ${selectedUserName}`,
        );
        await zsh(
          `git config --global --replace-all user.email ${selectedUserEmail}`,
        );
        await setActiveProfile(selectedUserName, selectedUserSSHKey);
        console.log(`Profile ${selectedUserName} activated successfully`);
      } else {
        console.log("Error changing SSH config");
      }
    }
  } else {
    console.log("Error selecting user");
    console.log(
      "You may need to first create a user and connected it with a key.",
    );
  }
}

export async function showActiveProfileStatus(returnData: boolean) {
  const kv = await Deno.openKv();
  const activeProfile = await kv.get(["activeProfile"]);
  const activeSSHKey = await kv.get(["activeSSHKey"]);
  kv.close();

  if (activeProfile.value === null || activeSSHKey.value === null) {
    console.log("There is no current active profile");
    return false;
  }

  if (returnData === false) {
    console.log(
      `Current active profile: ${activeProfile?.value} | Current active SSH key: ${activeSSHKey?.value}`,
    );
  } else {
    const username = activeProfile.value;
    const ssh = activeSSHKey.value;

    return { username, ssh };
  }
}

// Возможно эта система понадобится в дальнейшем
// export async function deactivateProfile() {
//   const kv = await Deno.openKv();
//   const activeProfile = await kv.get(["activeProfile"]);
//   const activeSSHKey = await kv.get(["activeSSHKey"]);
//   if (activeProfile.value === null || activeSSHKey.value === null) {
//     console.log("No active profile");
//   }

//   await kv.delete(["activeProfile"]);
//   await kv.delete(["activeSSHKey"]);

//   kv.close();

//   console.log("Profile deactivated successfully");
// }
