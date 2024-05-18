import { Token } from "../types/Token";
import { TokenType } from "../types/TokenType";

export class Parser {

    private pos: number;
    private currentToken: Token;

    private tokens: Token[];

    private tree: any;

    constructor(tokens: Token[]) {
        this.pos = 0;
        this.tokens = tokens;

        this.currentToken = tokens[this.pos];
    }

    stmt() {

        if(this.currentToken.type === TokenType.LET) {
            
        }

    }

}