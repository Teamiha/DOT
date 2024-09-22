import { zsh } from "@vseplet/shelly";
import { showActiveUser } from "./activateProfile.ts";
import { ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";

const CURRENTDIRECTORY = Deno.cwd();
const LOCALREPOSITORY = `${CURRENTDIRECTORY}/repository/`;
const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;

const PATHTOTEST = `${Deno.env.get("HOME")}/.ssh/DOT/testconfig`;

async function setCurrentUserAsLocal() {
  const activeUser = await showActiveUser();
  await zsh(`git config --local user.name "${activeUser[0]}"`);
  await zsh(`git config --local user.email "${activeUser[1]}"`);
}

function parseGitUrl(url: string): { source: string; username: string; repository: string } {
    // Regular expression to match the parts of the Git URL
    const regex = /^git@([^:]+):([^/]+)\/(.+)$/;
    
    // Try to match the URL against the regex
    const match = url.match(regex);
    
    if (!match) {
      throw new Error("Invalid Git URL format");
    }
    
    // Destructure the matched groups
    const [, source, username, repository] = match;
    
    return { source, username, repository };
  }
  

async function updateConfigToNewLocalRepository() {
  const updateBlock = "";
  await ensureFile(PATHTOTEST);
  const file = await Deno.open(PATHTOTEST, {
    write: true,
    append: true,
  });
  const encoder = new TextEncoder();
  await file.write(encoder.encode("\n" + updateBlock));
  file.close();
}

async function connectLocalRepositoryToCurrentSSH() {
}

async function parsingGitCloneCommand() {
}






async function test(){

    const gitUrl = "git@gitlab.com:petproject2655638/privatetest.git";

    try {
      const { source, username, repository } = parseGitUrl(gitUrl);
      console.log("Source:", source);
      console.log("Username:", username);
      console.log("Repository:", repository);
    } catch (error) {
      console.error("Error:", error.message);
    }

}

// test()