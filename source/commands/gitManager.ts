import { zsh } from "@vseplet/shelly";
import { showActiveUser } from "./activateProfile.ts";
import { ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";

const CURRENTDIRECTORY = Deno.cwd();
const LOCALREPOSITORY = `${CURRENTDIRECTORY}/repository/`;
const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTODOT = `${Deno.env.get("HOME")}/.ssh/DOT/`;

const PATHTOTEST = `${Deno.env.get("HOME")}/.ssh/DOT/testconfig`;



function parseGitUrl(
  url: string,
): { source: string; username: string; repository: string } {
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

async function updateConfigToNewLocalRepository(repositoryName: String, sshKey: String) {
  const gitUrl = "git@gitlab.com:petproject2655638/privatetest.git";
  const parseData = await parseGitUrl(gitUrl);

  const updateBlock = `Host ${repositoryName}
HostName ${parseData.repository}
User git
AddKeysToAgent yes
UseKeychain yes
IdentityFile ${Deno.env.get("HOME")}/.ssh/DOT/${sshKey}
IdentitiesOnly yes
UserKnownHostsFile ${PATHTODOT}known_hosts`;

  await ensureFile(PATHTOTEST);
  const file = await Deno.open(PATHTOTEST, {
    write: true,
    append: true,
  });
  const encoder = new TextEncoder();
  await file.write(encoder.encode("\n" + "\n" + updateBlock));
  file.close();
}

async function connectLocalRepositoryToCurrentSSH() {
}

async function setCurrentUserAsLocal() {
    const activeUser = await showActiveUser();
    await zsh(`git config --local user.name "${activeUser[0]}"`);
    await zsh(`git config --local user.email "${activeUser[1]}"`);
}


// async function test() {
//   const gitUrl = "git@gitlab.com:petproject2655638/privatetest.git";

//   try {
//     const { source, username, repository } = parseGitUrl(gitUrl);
//     console.log("Source:", source);
//     console.log("Username:", username);
//     console.log("Repository:", repository);
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// }

// test()


