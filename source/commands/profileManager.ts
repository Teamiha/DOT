import { Command } from "/Users/jegnum/Programming/Projects/DOT/deps.ts"
import { readLines } from "https://deno.land/std/io/mod.ts"

export async function getUserInput(prompt: string): Promise<string> {
  console.log(prompt);
  for await (const line of readLines(Deno.stdin)) {
    return line.trim();
  }
  throw new Error("No input received");
}

export async function createNewProfile() {
  const name = await getUserInput("Please enter a name:");
  const ssh = undefined;
  const kv = await Deno.openKv();
  const newSsh = { "SSH": ssh }
  
  await kv.set(["Name:", name], newSsh);
  
  console.log(`User ${name} saved successfully`);
  
  // const savedUser = await kv.get([name]);
  // console.log("Retrieved user:", savedUser.value);
  // console.log(savedUser)
  
  kv.close();
}

export async function getProfileList() {
  const kv = await Deno.openKv();
  
  const iter = kv.list<string>({ prefix: ["Name:"] });
  const users = [];
  
  for await (const res of iter) users.push(res);
  for (let i = 0; i < users.length; i++) {
    console.log(users[i])
  }
    
  kv.close();
}

// createNewProfile()

// getProfileList()