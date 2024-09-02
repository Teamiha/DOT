import { Command } from "/Users/jegnum/Programming/Projects/DOT/deps.ts"
import { readLines } from "https://deno.land/std/io/mod.ts"

async function getUserInput(prompt: string): Promise<string> {
  console.log(prompt);
  for await (const line of readLines(Deno.stdin)) {
    return line.trim();
  }
  throw new Error("No input received");
}



async function createNewProfile() {
  const name = await getUserInput("Please enter a name:");
  const ssh = undefined;
  
  const kv = await Deno.openKv();
  
  // const newUser = { "Name": name };
  
  const newSsh = { "SSH": ssh }
  
  await kv.set(["Name:", name], newSsh);
  
  console.log(`User ${name} saved successfully`);
  
  // const savedUser = await kv.get(["users", name]);
  const savedUser = await kv.get([name]);
  
  console.log("Retrieved user:", savedUser.value);
  console.log(savedUser)
  
  kv.close();
  
}

async function getProfileList() {
  const kv = await Deno.openKv();
  
  const iter = kv.list<string>({ prefix: ["Name:"] });
  const users = [];
  for await (const res of iter) users.push(res);
  for (let i = 0; i < users.length; i++) {
    console.log(users[i])
  }
    
  
  // console.log(users[0]); // { key: ["users", "alex"], value: "alex", versionstamp: "00a44a3c3e53b9750000" }
  // console.log(users[1]); // { key: ["users", "sam"], value: "sam", versionstamp: "00e0a2a0f0178b270000" }
  // console.log(users[2]); // { key: ["users", "taylor"], value: "taylor", versionstamp: "0059e9035e5e7c5e0000" }
  
  // const rez = await kv.list;
  
  // console.log(rez);
  
  kv.close();
}

// createNewProfile()

getProfileList()