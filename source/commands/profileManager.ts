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
  
  const kv = await Deno.openKv();
  
  const newUser = { "Name": name };
  
  await kv.set(["users", newUser.Name], newUser);
  
  console.log(`User ${name} saved successfully`);
  
  const savedUser = await kv.get(["users", name]);
  
  console.log("Retrieved user:", savedUser.value);
  console.log(savedUser)
  
  kv.close();
  
}

async function getProfileList() {
  const kv = await Deno.openKv();
  
  const rez = await kv.get(["users", "A"]);
  
  console.log(rez);
  
  kv.close();
}

// createNewProfile()

getProfileList()