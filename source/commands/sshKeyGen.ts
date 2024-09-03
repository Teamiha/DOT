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

  async function test() {
    const testlog = await getUserInput("Enter:");
    console.log(testlog);


  }

test();


