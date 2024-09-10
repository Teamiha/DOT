import { Command } from "@cliffy/command";
import { readLines } from "https://deno.land/std/io/mod.ts";
import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { selectUserCore } from "./selectCore.ts";
import { getUserInput } from "./service.ts";

export async function createNewProfile() {
  const name = await getUserInput("Please enter a name:");
  const email = await getUserInput("Please enter a email:");
  const ssh = "Empty";
  const kv = await Deno.openKv();
  const newSsh = ssh;

  await kv.set(["UserName:", name, "Email:", email], ["connectedSSH", ssh]);

  console.log(`User ${name} saved successfully`);

  kv.close();
}

export async function getProfileList(): Promise<Array<Deno.KvEntry<string>>> {
  const kv = await Deno.openKv();

  const iter = kv.list<string>({ prefix: ["UserName:"] });
  const users = [];

  for await (const res of iter) users.push(res);

  kv.close();

  return users;
}

export async function chooseProfile() {
  const data = await getProfileList();
  const result = await selectUserCore(data);

  const name = result?.[0] ?? "Unknown";
  const email = result?.[2] ?? "Unknown";
  const connectedSSH = result?.[1] ?? "Unknown";

  console.log("Name:", name, "|", "Email:", email, "|", "connectedSSH:", connectedSSH);
  
}



// createNewProfile();

// getProfileList()
// chooseProfile()


