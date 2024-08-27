import { Command } from "../deps.ts";

console.log("hello!");

await new Command()
  .name("cliffy")
  .version("0.1.0")
  .description("Command line framework for Deno")
  .parse(Deno.args);
