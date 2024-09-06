import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { getProfileList } from "./profileManager.ts";
import { getAllSshKeysList } from "./sshKeyGen.ts";

export async function connectUserToSsh() {
    const userList = await getProfileList();
    const sshList = await getAllSshKeysList();
    if (userList.length > 0) {
      const selectedUser = await Select.prompt({
        message: "Choose user:",
        options: userList.map(key => ({
          name: key.key[1] as string,
          value: { name: key.key[1], ssh: key.value[1] },
        })),
      });
      const { name, ssh } = (selectedUser);
      console.log(`You selected: ${name}`);
      console.log(`SSH value: ${ssh}`);
    } else {
      console.log("No users found.");
    }
  }