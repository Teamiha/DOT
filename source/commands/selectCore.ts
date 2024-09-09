import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

export async function selectCore(
  dataArray: Array<Deno.KvEntry<string>>,
  welcomeMessage: string,
  
  action: (first: string, second: string, third: string) => void,
) {
  const data = await dataArray;

  if (data.length > 0) {
    const selectedObject = await Select.prompt({
      message: welcomeMessage,
      options: data.map((key) => ({
        name: key.key[1] as string,
        value: { first: key.key[1], second: key.value[1], third: key.key[3] },
      })),
    });

    const { first, second, third } = selectedObject as unknown as {
      first: string;
      second: string;
      third: string;
    };

    action(first as string, second as string, third as string);

  } else {
    console.log("No data found.");
  }
}

//   async function testSelectCore() {
//     const data = await getProfileList();
//     selectCore(data, "Choose a profile", (name, ssh, email) => {
//       console.log(name, ssh, email);
//       console.log("name:", name);
//       console.log("ssh:", ssh);
//       console.log("email:", email);
//     });
//   }

// testSelectCore();
