import { Lexer } from "./lexer/lexer";
import { Bundler } from "./bundler/bundler";
import { Parser } from "./parser/parser";
import { writeFileSync } from "fs";
import { ChildProcess, exec } from "child_process";

const lexer = new Lexer('/index.t1');

const bundle = new Bundler(lexer);

writeFileSync('Tokents.json', JSON.stringify(bundle.tokens));

const parse = new Parser(bundle.tokens);

writeFileSync('ParseTreeRaw.json', JSON.stringify(parse.program()));

exec('python tree.py');