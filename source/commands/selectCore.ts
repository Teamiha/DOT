import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
// import { getProfileList } from "./profileManager.ts";
// import { getAllSshKeysList } from "./sshKeyGen.ts";

export async function selectUserCore(
  dataArray: Array<Deno.KvEntry<string>>,
  action: (name: string, email: string, sshKey: string) => void,
) {
  const data = await dataArray;

  if (data.length > 0) {
    const selectedObject = await Select.prompt({
      message: "Select User",
      options: data.map((key) => ({
        name: key.key[1] as string,
        value: { name: key.key[1], sshKey: key.value[1], email: key.key[3] },
      })),
    });

    const { name, sshKey, email } = selectedObject as unknown as {
      name: string;
      sshKey: string;
      email: string;
    };

    action(name as string, sshKey as string, email as string);

  } else {
    console.log("No data found.");
  }
}

export async function selectSshKeyCore(
    dataArray: Array<Deno.KvEntry<string>>,
    action: (name: string, keyAdress: string, conectionUser: string) => void,
  ) {
    const data = await dataArray;
  
    if (data.length > 0) {
      const selectedObject = await Select.prompt({
        message: "Select SSH Key",
        options: data.map((key) => ({
          name: key.key[1] as string,
          value: { name: key.key[1], keyAdress: key.value[1], conectionUser: key.key[3] },
        })),
      });
  
      const { name, keyAdress, conectionUser } = selectedObject as unknown as {
        name: string;
        keyAdress: string;
        conectionUser: string;
      };
  
      action(name as string, keyAdress as string, conectionUser as string);
  
    } else {
      console.log("No data found.");
    }
  }





//   async function testSelectCore() {
//     const data = await getAllSshKeysList();
//     selectSshKeyCore(data, (name, keyAdress, conectionUser) => {
//       console.log(name, keyAdress, conectionUser);
//       console.log("name:", name);
//       console.log("keyAdress:", keyAdress);
//       console.log("conectionUser:", conectionUser);
//   });
// }

// testSelectCore();
