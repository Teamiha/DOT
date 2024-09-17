import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { readGitConfigFile } from "./service.ts";
import { getUserList } from "./userManager.ts";
import { selectUserCore } from "./selectCore.ts";
import { zsh } from "@vseplet/shelly";

// ЗАМЕНИТЬ!!!!
const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/testconfig`;
const PATHTOSSHKEYS = `${Deno.env.get("HOME")}/.ssh/`;

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

  //   console.log(convertResult)

  //   console.log(`Value ${key} successfully changed to ${newValue}`);
}

export async function activateProfile() {
  const data = await getUserList();
  const selectedUser = await selectUserCore(data);
  const selectedUserName = selectedUser?.[0] ?? "Empty";

  console.log(selectedUserName);

  const selectedUserSSHKey = selectedUser?.[1] ?? "Empty";
  const selectedUserEmail = selectedUser?.[2] ?? "Empty";

  if (selectedUser !== undefined) {
    if (selectedUserSSHKey === "Empty") {
      console.log("This user does not have an SSH key attached.");
    } else {
      const newKey = await changeSSHConfig(
        "IdentityFile",
        `${PATHTOSSHKEYS}${selectedUserSSHKey}`,
      ) || { success: false };
      if (newKey.success === true) {
        // await zsh(`git config --global --replace-all user.name ${selectedUserName}`);
        // await zsh(`git config --global --replace-all user.email ${selectedUserEmail}`);
        await setActiveProfile(selectedUserName, selectedUserSSHKey);
        console.log(`Profile ${selectedUserName} activated successfully`);
      } else {
        console.log("Error changing SSH config");
      }
    }
  } else {
    console.log("Error selecting user");
  }
}

export async function showActiveProfileStatus() {
  const kv = await Deno.openKv();
  const activeProfile = await kv.get(["activeProfile"]);
  const activeSSHKey = await kv.get(["activeSSHKey"]);
  kv.close();

  if (activeProfile.value === null || activeSSHKey.value === null) {
    console.log("No active profile found");
  } else {
    console.log(
      `Current active profile: ${activeProfile?.value} | Current active SSH key: ${activeSSHKey?.value}`,
    );
  }
}

// Добработать
export async function deactivateProfile() {
  const kv = await Deno.openKv();
  const activeProfile = await kv.get(["activeProfile"]);
  const activeSSHKey = await kv.get(["activeSSHKey"]);
  if (activeProfile.value === null || activeSSHKey.value === null) {
    console.log("No active profile");
  }

  await kv.delete(["activeProfile"]);
  await kv.delete(["activeSSHKey"]);

  kv.close();
}

// activateProfile();
// showActiveProfileStatus();
// checkIsThisUserActive("Jegnum");
// deactivateProfile()
