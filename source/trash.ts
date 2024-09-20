import { zsh } from "@vseplet/shelly";
import { ensureFile } from "https://deno.land/std/fs/mod.ts";

/*

import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { getProfileList } from "./commands/profileManager.ts";

async function chooseProfileBeta(
    dataArray: Array<Deno.KvEntry<string>>,
    action: (first: string, second: string, third: string) => void,
  ) {
    const data = await dataArray;
    if (data.length > 0) {
      // надо разобраться
      const selectedObject = await Select.prompt({
        message: "Choose user:",
        options: data.map((key) => ({
          name: key.key[1] as string,
          value: { first: key.key[1], second: key.value[1], third: key.key[3] },
        })),
      });

      console.log("selectedObject:", selectedObject);

      const { first, second, third } = selectedObject as unknown as {
        first: string;
        second: string;
        third: string;
      };
      console.log("first:", first);
      console.log("second:", second);
      console.log("third:", third);

      console.log("when i try to use selectedObject.value.first i get error")
      console.log(selectedObject.value.first)

      action(first as string, second as string, third as string);
    } else {
      console.log("No data found.");
    }
  }

  async function testChooseProfileBeta() {
    const data = await getProfileList();
    chooseProfileBeta(data, (name, ssh) => {
      console.log(name, ssh);
    });
  }

  export async function deleteProfile() {
    const data = await getProfileList();
  }



*/
const filePath = `${Deno.env.get("HOME")}/.zshrcTest`;
const newLine = 'export GIT_SSH_COMMAND="ssh -F /custom/path/ssh_config"';


// async function reset() {
//    await zsh(`unset GIT_SSH_COMMAND`);
// }

async function test(path: string, content: string) {
  await ensureFile(path);
  const file = await Deno.open(path, { write: true, append: true });
  const encoder = new TextEncoder();
  await file.write(encoder.encode("\n" + content + "\n"));
  file.close();

}




// console.log(await test())
// test(filePath, newLine)

// removeLineFromFile(filePath, newLine)
