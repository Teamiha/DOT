import { zsh } from "@vseplet/shelly"
import { showActiveUser } from "./activateProfile.ts";

const CURRENTDIRECTORY = Deno.cwd()
const LOCALREPOSITORY = `${CURRENTDIRECTORY}/repository/`


async function setCurrentUserAsLocal() {
    const activeUser = await showActiveUser()
    await zsh(`git config --local user.name "${activeUser[0]}"`);
    await zsh(`git config --local user.email "${activeUser[1]}"`);
}

