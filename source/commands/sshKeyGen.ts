import { readLines } from "https://deno.land/std/io/mod.ts"
import { shelly, zsh } from "@vseplet/shelly";

export function hasCyrillicCharacters(str: string): boolean {
  return /[\u0400-\u04FF]/.test(str);
}  

export async function getUserInput(prompt: string): Promise<string> {
    console.log(prompt);
    for await (const line of readLines(Deno.stdin)) {
      const trimmedLine = line.trim();
      if (hasCyrillicCharacters(trimmedLine)) {
        console.log("Error: Cyrillic characters are not allowed. Please try again.");
        continue;
      }
      return trimmedLine;
    }
    throw new Error("No input received");
  }

export async function createNewSshKey() {
  const kv = await Deno.openKv();

  const name = await getUserInput("Enter a name for the SSH key:");
  const email = await getUserInput("Enter your email:");
  const ssh = await zsh (`ssh-keygen -t ed25519 -C ${email} -f ~/.ssh/${name}`);

  if (ssh.success === true) {
    console.log("SSH key generated successfully");
    const sshKeyAdress = { "Adress": `~/.ssh/${name}` }
    await kv.set(["Name:", name], sshKeyAdress);
  } else {
    console.log("Error: SSH key generation failed");
  }

  kv.close();
}


  async function test() {
    const testlog = await getUserInput("Enter:");
    console.log(testlog);


  }

createNewSshKey();
// test();


