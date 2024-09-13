import { Select } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { readGitConfigFile } from "./service.ts";

// function parseSSHConfig(content: string): Record<string, string> {
//     const config: Record<string, string> = {};
//     const lines = content.split('\n');
//     let currentHost = '';
  
//     for (const line of lines) {
//       const trimmedLine = line.trim();
//       if (trimmedLine.startsWith('Host ')) {
//         currentHost = trimmedLine.split(' ')[1];
//         config[currentHost] = {};
//       } else if (trimmedLine && currentHost) {
//         const [key, ...valueParts] = trimmedLine.split(' ');
//         const value = valueParts.join(' ');
//         config[currentHost][key] = value;
//       }
//     }
  
//   return config;
// }

async function testing() {
    
const rez = await readGitConfigFile(Deno.env.get("HOME") + "/.ssh/testconfig");
if (rez !== undefined) {
for (const item of rez) {
    console.log(`${item.key} ${item.value}`);
  }

  const hostItem = rez.find(item => item.key === "Host");
  if (hostItem) {
    console.log(hostItem.value);
  }
} else {
   console.log("Error getting config")
}

}

testing()