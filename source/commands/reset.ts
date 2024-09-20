const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTODOT = `${Deno.env.get("HOME")}/.ssh/DOT/`;

// Сделать вариантативность и чекать какой шелл.
const PATHTOSHELLCONFIG = `${Deno.env.get("HOME")}/.zshrcTest`;

async function resetShellConfig() {
  const lineToRemove = 'export GIT_SSH_COMMAND="ssh -F ' + PATHTOGITCONFIG +
    '"';
  const fileContent = await Deno.readTextFile(PATHTOSHELLCONFIG);
  const lines = fileContent.split("\n");
  const newLines = lines.filter((line) => line.trim() !== lineToRemove.trim());

  if (lines.length === newLines.length) {
    console.log("The specified line was not found in the file.");
    return;
  }

  const newContent = newLines.join("\n");
  await Deno.writeTextFile(PATHTOSHELLCONFIG, newContent);
  console.log("Line removed successfully!");
}
