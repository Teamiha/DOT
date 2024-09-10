import { Command } from "@cliffy/command";

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


