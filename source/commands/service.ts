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

  export async function disconnectSshKeyAndUser(keyName: string, username: string, email: string) {
    const kv = await Deno.openKv();
    const user = await kv.get(["userName:", username, "Email:", email])
    console.log(user)
  }
  
  const testName = "Mikhail"
  const testEmail = "ssss@rkdjg"
//   const cleanedInput: string = testName.replace(/["]+/g, '');
  disconnectSshKeyAndUser("test", testName, testEmail)