import { Lexer } from "./lexer/lexer";
import { Bundler } from "./bundler/bundler";

const lexer = new Lexer('/index.t1');

const bundle = new Bundler(lexer);

console.log(bundle.tokens);