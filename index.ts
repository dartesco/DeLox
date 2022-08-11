import Token from './token.ts';
import Scanner from './scanner.ts';

let hadError = false;

async function main(args: string[]) {
  if (args.length > 1) {
    console.warn("Usage: delox [script]");
    return;
  } else if (args.length == 1) {
    runFile(args[0]);
  } else {
    runPrompt();
  }
}

async function runFile(path: string) {
  const fileText = await Deno.readTextFile(path);
  run(fileText);
}

function runPrompt() {
  while (true) {
    const line = prompt("> ");
    if (!line || line.length < 1) break;
    run(line);
    hadError = false;
  }
}

function run(source: string) {
  const scanner = new Scanner(source);
  const tokens: [Token] = scanner.scanTokens();

  for (let token in tokens) {
    console.log(token);
  }
}

function error(line: int, message: string) {
  report(line, "", message);
}

function report(line: int, where: string, message: string) {
  console.error(`[line ${line}] Error ${where}: ${message}`);
  hadError = true;
}

main(Deno.args);