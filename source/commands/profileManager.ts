import { Command } from "@cliffy/command"
import { readLines } from "https://deno.land/std/io/mod.ts"
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

export async function getUserInput(prompt: string): Promise<string> {
  console.log(prompt);
  for await (const line of readLines(Deno.stdin)) {
    return line.trim();
  }
  throw new Error("No input received");
}

export async function createNewProfile() {
  const name = await getUserInput("Please enter a name:");
  const ssh = "Empty";
  const kv = await Deno.openKv();
  const newSsh = ssh 
  
  await kv.set(["Name:", name], ["SSH", ssh]);
  
  console.log(`User ${name} saved successfully`);
  
  // const savedUser = await kv.get([name]);
  // console.log("Retrieved user:", savedUser.value);
  // console.log(savedUser)
  
  kv.close();
}

export async function getProfileList(): Promise<Array<Deno.KvEntry<string>>> {
  const kv = await Deno.openKv();
  
  const iter = kv.list<string>({ prefix: ["Name:"] });
  const users = [];
  
  for await (const res of iter) users.push(res);
  for (let i = 0; i < users.length; i++) {
    console.log(users[i])
  }
    
  kv.close();
  return users;
}

export async function chooseProfile() {
  const userList = await getProfileList();
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




// createNewProfile()

// getProfileList()
// chooseProfile()
