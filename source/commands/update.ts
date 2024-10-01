import { shelly } from "@vseplet/shelly";
import localDenoJson from "../../deno.json" with { type: "json" };
import { fetchJSON } from "./service.ts";

const ENTRYPOINT_SOURCE_URL = "https://raw.githubusercontent.com/vseplet/DOT/refs/heads/MikhailPlayground/source/main.ts"
const CURRENT_VERSION = "0.8.0"

export async function update() {
  const latestVersion = await getLatestVersion();
  if (latestVersion > CURRENT_VERSION) {
    console.log("Updating to the latest version...");
    await shelly(["deno",
        "install",
        "-r",
        "-f",
        "--allow-net",
        "--allow-run",
        "--unstable-kv",
        "-n",
        "pp",
        ENTRYPOINT_SOURCE_URL,]);
  } else {
    console.log("You are using the latest version of DOT.");
  }
}

async function getLatestVersion() {
    const response = await fetchJSON("https://raw.githubusercontent.com/vseplet/DOT/refs/heads/MikhailPlayground/deno.json") as unknown as typeof localDenoJson;
    const latestVersion = response.version;
    return latestVersion;
}

