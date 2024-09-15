import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { readGitConfigFile } from "./service.ts";

// ЗАМЕНИТЬ!!!!
const PATHTOGITCONFIG = `${Deno.env.get("HOME")}/.ssh/testconfig`;

function stringifySSHConfig(
  config: { key: string; value: string }[] | undefined,
): string {
  if (config === undefined) {
    return "";
  }
  return config.map((entry) => `${entry.key} ${entry.value}`).join("\n");
}

async function changeSSHConfig(key: string, newValue: string) {
  const rawData = await readGitConfigFile(PATHTOGITCONFIG);

  if (rawData !== undefined) {
  const entry = rawData.find(entry => entry.key === key);
  if (entry) {
    entry.value = newValue;
  } else {
    console.error(`Key "${key}" not found in the config.`);
  }
} else {
    console.log("Error getting config");
}

  const convertResult = stringifySSHConfig(rawData);

  await Deno.writeTextFile(PATHTOGITCONFIG, convertResult)

  console.log(`Value ${key} successfully changed to ${newValue}`);
  

}

// changeSSHConfig("Host", "test");
