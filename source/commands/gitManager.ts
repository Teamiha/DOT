import { zsh } from "@vseplet/shelly";
import { showActiveProfileStatus } from "./activateProfile.ts";
import { ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";
import { getUserInput } from "./service.ts";
import { string } from "jsr:@cliffy/flags@1.0.0-rc.5";
import { Confirm } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

const CURRENTDIRECTORY = Deno.cwd();
const LOCALREPOSITORY = `${CURRENTDIRECTORY}/repository/`;
const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/DOT/config`;
const PATHTODOT = `${Deno.env.get("HOME")}/.ssh/DOT/`;

// const PATHTOTEST = `${Deno.env.get("HOME")}/.ssh/DOT/testconfig`;

export async function gitClone() {
  const activeUserStatus = await showActiveProfileStatus(true);
  if (activeUserStatus === false) {
    console.log("Select and activate a profile first");
    return;
  }
  console.log(
    `When cloning a repository, the SSH key of the currently active profile will be linked to its local version.`,
  );
  console.log(`Current key: ${activeUserStatus?.ssh}`);
  const confirmed: boolean = await Confirm.prompt("Do you understand?");
  if (!confirmed) {
    console.log("Cancel cloning");
    return;
  }

  //   const username = activeUserStatus?.username;
  const ssh = activeUserStatus?.ssh as string ?? "Empty";
  const gitCloneURL = await getUserInput(
    "Paste the link to clone the repository via SSH",
  );
  const repositoryName = await getUserInput(
    "Enter a unique name for this clone.",
  );
  const parseGitUrlData = await parseGitUrl(gitCloneURL);

  await updateConfigToNewLocalRepository(
    repositoryName,
    ssh,
    parseGitUrlData.source,
  );
  console.log("Update config --- Done.");

  await zsh(`git clone ${gitCloneURL}`);
  console.log("repository clone --- Done");

  
  await zsh(
    `git remote set-url origin git@${parseGitUrlData.source}-${repositoryName}:${parseGitUrlData.username}/${parseGitUrlData.repository}`,
  );
  console.log("Git set new URL --- Done");
}

function parseGitUrl(
  url: string,
): { source: string; username: string; repository: string } {
  const regex = /^git@([^:]+):([^/]+)\/(.+)$/;

  const match = url.match(regex);

  if (!match) {
    throw new Error("Invalid Git URL format");
  }

  const [, source, username, repository] = match;

  return { source, username, repository };
}

async function updateConfigToNewLocalRepository(
  repositoryName: string,
  sshKey: string,
  source: string,
) {
  const updateBlock = `Host ${repositoryName}
HostName ${source}
User git
AddKeysToAgent yes
UseKeychain yes
IdentityFile ${Deno.env.get("HOME")}/.ssh/DOT/${sshKey}
IdentitiesOnly yes
UserKnownHostsFile ${PATHTODOT}known_hosts`;

  await ensureFile(PATHTOGITCONFIG);
  const file = await Deno.open(PATHTOGITCONFIG, {
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
gitClone();
