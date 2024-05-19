import path from "path";
import { Lexer } from "../lexer/lexer";
import { Token } from "../utils/types/Token";
import { TokenType } from "../utils/enums/TokenType";

export class Bundler {

    public tokens: Token[] = [];

    constructor(lexer: Lexer) {

        const tokens = lexer.tokens;

        this.loadTokens(tokens, lexer.path);

        const filteredTokens: Token[] = []
        for (let i = 0; i < this.tokens.length; i++) {
            if (!(this.tokens[i].type === TokenType.STRING && this.tokens[i - 1].type === TokenType.IMPORT) && !(this.tokens[i].type === TokenType.IMPORT))
                filteredTokens.push(this.tokens[i]);
        }

        this.tokens = filteredTokens;
    }

    loadTokens(tokens: Token[], fpath: string) {
        for (let i = 0; i < tokens.length; i++) {
            this.tokens.push(tokens[i]);

            if (!tokens[i - 1]) continue;

            if (tokens[i - 1].type === TokenType.IMPORT) {
                if (tokens[i].type === TokenType.STRING) {

                    const newLexer = new Lexer(tokens[i].value!);

                    if (newLexer.tokens[newLexer.tokens.length - 1].type === TokenType.EOF) newLexer.tokens.pop();

                    this.loadTokens(newLexer.tokens, newLexer.path);
                }
                else {
                    console.log('Invalid IMPORT statement at ' + path.join(__dirname, '../../input', fpath) + `:${tokens[i].line}:${tokens[i].col}`);
                    return;
                }

            }
        }
    }

}