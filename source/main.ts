import { Command } from "@cliffy/command";

console.log("hello!");

await new Command()
  .name("cliffy")
  .version("0.1.0")
  .description("Command line framework for Deno")
  .parse(Deno.args);
