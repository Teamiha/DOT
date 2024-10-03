import localDenoJson from "../../deno.json" with { type: "json" };
const CURRENT_VERSION = localDenoJson["version"];

const aboutText = `
Text about programm.
Beta.
Version: ${CURRENT_VERSION}
`;

export function about() {
  console.log(aboutText);
}

