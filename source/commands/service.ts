import { readLines } from "https://deno.land/std/io/mod.ts";

export function hasCyrillicCharacters(str: string): boolean {
    return /[\u0400-\u04FF]/.test(str);
  }

export async function getUserInput(prompt: string): Promise<string> {
    console.log(prompt);
    for await (const line of readLines(Deno.stdin)) {
      const trimmedLine = line.trim();
      if (hasCyrillicCharacters(trimmedLine)) {
        console.log(
          "Error: Cyrillic characters are not allowed. Please try again.",
        );
        continue;
      }
      return trimmedLine;
    }
    throw new Error("No input received");
  }

  export async function readGitConfigFile(filePath: string) {
    try {
      const content = await Deno.readTextFile(filePath);
      const lines = content.split("\n");
  
      for (const line of lines) {
        const trimmedLine = line.trim();
        const [key, value] = trimmedLine.split(/\s+/);
        console.log(`${key} - ${value}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
    }
  } 

  export async function disconnectSshKeyAndUser(username: string, keyName: string) {

    const kv = await Deno.openKv();
    const user = await kv.get<string>(["userName:", username])    
    // const key = await kv.get(["sshKeyName:", keyName])

    const email = user.value?.[3] ?? "Unknown";
    
    await kv.set(["userName:", username], ["connectedSSH", "Empty", "Email:", email]);
    await kv.set(["sshKeyName:", keyName], ["connectedUser", "Empty"]);
  
    console.log(`User ${username} disconnected to SSH key ${keyName}`);

    kv.close();
  }
  
  export async function deleteSelectedKvObject(key: string, value: string) {
    const kv = await Deno.openKv();
    await kv.delete([key, value]);
    kv.close();
  }


  