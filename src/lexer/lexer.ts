import { readFileSync } from "fs";
import { Token } from "../utils/types/Token";
import { TokenType } from "../utils/enums/TokenType";
import path from "path";

export class Lexer {

    private text: string;
    private pos: number;

    private line: number;
    private col: number;


    private currentChar: string | undefined;
    public tokens: Token[];

    public path: string;

    constructor(fpath: string) {
        const text = readFileSync(path.join(__dirname, '../../input', fpath));

        this.path = fpath;
        this.text = text.toString();
        this.pos = 0;
        this.line = 1;
        this.col = 1;
        this.currentChar = this.text.at(this.pos);

        const tokens: Token[] = [];

        let token = this.getNextToken();
        tokens.push(token);

        while (token.type != TokenType.EOF) {
            token = this.getNextToken();
            tokens.push(token);
        }

        this.tokens = tokens;
    }

    error() {
        throw new Error('Parsing Error');
    }

    walk() {
        this.pos += 1;
        this.col += 1;

        if (this.pos >= this.text.length) this.currentChar = undefined;

        else this.currentChar = this.text.at(this.pos)!;

        this.skipWhiteSpace();
    }

    walkString() {
        this.pos += 1;
        this.col += 1;

        if (this.pos >= this.text.length) this.currentChar = undefined;

        else this.currentChar = this.text.at(this.pos)!;
    }

    skipWhiteSpace() {
        while (this.currentChar === ' ' && this.currentChar !== null) {
            this.walk();
        }
    }

    getNextToken(): Token {
        while (this.currentChar) {

            if (this.currentChar === ' ') {
                this.skipWhiteSpace();
                continue;
            }

            if (this.peakMatch('\r\n')) {
                this.line++;
                this.col = 1;
                continue;
            }

            if (this.currentChar === '+') {
                this.walk();
                return { type: TokenType.PLUS, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === '-') {
                this.walk();
                return { type: TokenType.MINUS, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === '*') {
                this.walk();
                return { type: TokenType.MUL, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === '/') {
                this.walk();
                return { type: TokenType.DIV, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === '=') {
                if (this.peakMatch('==')) return { type: TokenType.EQUAL, line: this.line, col: this.col, path: this.path };

                this.walk();
                return { type: TokenType.ASSIGN, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === '!') {
                if (this.peakMatch('!=')) return { type: TokenType.NOT, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === '>') {
                if (this.peakMatch('>=')) return { type: TokenType.EGREAT, line: this.line, col: this.col, path: this.path }

                this.walk();
                return { type: TokenType.GREAT, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === '<') {
                if (this.peakMatch('<=')) return { type: TokenType.ELESS, line: this.line, col: this.col, path: this.path }

                this.walk();
                return { type: TokenType.LESS, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === ';') {
                this.walk();
                return { type: TokenType.SEMI, line: this.line, col: this.col, path: this.path };
            }

            if (!isNaN(parseInt(this.currentChar))) {
                return { type: TokenType.INTEGER, value: this.eatInt(), line: this.line, col: this.col, path: this.path };
            }

            if (this.isAlpha(this.currentChar)) {
                if (this.peakMatch('let')) return { type: TokenType.LET, line: this.line, col: this.col, path: this.path }

                if (this.peakMatch('while')) return { type: TokenType.WHILE, line: this.line, col: this.col, path: this.path }

                if (this.peakMatch('if')) return { type: TokenType.IF, line: this.line, col: this.col, path: this.path }

                if (this.peakMatch('else')) return { type: TokenType.ELSE, line: this.line, col: this.col, path: this.path } 

                if (this.peakMatch('import')) return { type: TokenType.IMPORT, line: this.line, col: this.col, path: this.path }

                return { type: TokenType.IDENITIFIER, value: this.eatIdenifier(), line: this.line, col: this.col, path: this.path }
            }

            if (this.currentChar === '{') {
                this.walk();
                return { type: TokenType.LBRAC, line: this.line, col: this.col, path: this.path };
            }


            if (this.currentChar === '}') {
                this.walk();
                return { type: TokenType.RBRAC, line: this.line, col: this.col, path: this.path };
            }


            if (this.currentChar === '(') {
                this.walk();
                return { type: TokenType.LPRAN, line: this.line, col: this.col, path: this.path };
            }


            if (this.currentChar === ')') {
                this.walk();
                return { type: TokenType.RPRAN, line: this.line, col: this.col, path: this.path };
            }

            if (this.currentChar === '"') {
                this.walkString();
                let value: string = this.currentChar;
                let lineTemp = this.line;
                let colTemp = this.col

                this.walkString();
                while (this.currentChar !== '"') {
                    value += this.currentChar;
                    this.walkString();
                }
                this.walk();

                return { type: TokenType.STRING, value: value, line: lineTemp, col: colTemp, path: this.path };
            }

            return { type: TokenType.ILLEGAL, line: this.line, col: this.col, path: this.path };
        }

        return { type: TokenType.EOF, line: this.line, col: this.col, path: this.path }
    }

    peakMatch(str: string): boolean {
        let i = this.pos;

        const match = this.text.slice(this.pos, this.pos + str.length);

        if (match === str) {
            this.pos += str.length;
            this.currentChar = this.text.at(this.pos);
            return true;
        }
        return false;
    }

    eatInt() {
        let res = '';

        while (this.currentChar && !isNaN(+(this.currentChar))) {
            res += this.currentChar;
            this.walk();
        }
        return res;
    }

    eatIdenifier() {
        let res = '';

        while (this.currentChar && this.isAlpha(this.currentChar)) {
            res += this.currentChar;
            this.walk();
        }
        return res;
    }

    private isAlpha(str: string) {
        return /^[a-zA-Z]+$/i.test(str);
    }

}
