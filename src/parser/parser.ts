import { Token } from "../utils/types/Token";
import { TokenType } from "../utils/enums/TokenType";
import { _Node, Assign_stmt, Cond, Digit, Expr, Factor, id, If_stmt, Program, Rel_op, Rest, Rest1, Stmts, Term, While_stmt } from "../utils/types/Node";

export class Parser {

    private pos: number;
    private currentToken: Token;

    private tokens: Token[];

    public tree: _Node;

    constructor(tokens: Token[]) {
        this.pos = 0;
        this.tokens = tokens;

        this.currentToken = tokens[this.pos];

        this.tree = {
            type: 'Program',
            childrens: []
        }
    }

    error() {
        throw new Error('Invalid Token at ' + `${this.currentToken.path}:${this.currentToken.line}:${this.currentToken.col}`)
    }

    match(type: TokenType): Token | undefined {
        if (this.currentToken.type === type) {
            const token = this.currentToken;
            this.pos++;
            this.currentToken = this.tokens[this.pos];
            return token;
        }

        this.error();
    }

    program(): Program {

        return {
            type: "Program",
            childrens: [this.stmts()],
        }
    }


    stmt(): _Node {

        if (this.currentToken.type === TokenType.LET) {
            return this.assign();
        }

        if (this.currentToken.type === TokenType.IF) {
            return this.if_stmt();
        }

        if (this.currentToken.type === TokenType.WHILE) {
            return this.while_stmt();
        }

        if (this.currentToken.type === TokenType.LBRAC) {
            const node: _Node = {
                type: 'Stmt',
                childrens: []
            }

            this.match(TokenType.LBRAC);
            node.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.LBRAC
            })

            
            node.childrens.push(this.stmts());

            
            this.match(TokenType.RBRAC);
            node.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.RBRAC
            })
            
            return node;
        }

        this.error()
        return {
            type: 'e',
            childrens: []
        }
    }

    while_stmt(): While_stmt {
        const childs: _Node[] = [];

        this.match(TokenType.WHILE);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: TokenType.WHILE
        })

        this.match(TokenType.LPRAN);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: TokenType.LPRAN
        })

        childs.push(this.cond());

        this.match(TokenType.RPRAN);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: TokenType.RPRAN
        })

        childs.push(this.stmt()!);

        return {
            type: "While_stmt",
            childrens: childs
        }
    }

    if_stmt(): If_stmt {

        const childs: _Node[] = [];

        this.match(TokenType.IF);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: 'if'
        })

        this.match(TokenType.LPRAN);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: '('
        })

        childs.push(this.cond());

        this.match(TokenType.RPRAN);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: ')'
        })

        childs.push(this.stmt()!);

        return {
            type: "If_stmt",
            childrens: childs
        }
    }

    cond(): Cond {
        const childs: _Node[] = [];

        childs.push(this.id());
        childs.push(this.rel_op());
        childs.push(this.factor());

        return {
            type: "Cond",
            childrens: childs
        }
    }

    rel_op(): Rel_op {

        const rel_op: Rel_op = {
            type: 'Rel_op',
            childrens: []
        }

        if (this.currentToken.type === TokenType.GREAT) {
            this.match(TokenType.GREAT);
            rel_op.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.GREAT
            });
            return rel_op;
        }

        if (this.currentToken.type === TokenType.EQUAL) {
            this.match(TokenType.EQUAL);
            rel_op.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.EQUAL
            });
            return rel_op;
        }

        if (this.currentToken.type === TokenType.LESS) {
            this.match(TokenType.LESS);
            rel_op.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.LESS
            });
            return rel_op;
        }

        if (this.currentToken.type === TokenType.NOT) {
            this.match(TokenType.NOT);
            rel_op.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.LESS
            });
            return rel_op;
        }

        if (this.currentToken.type === TokenType.EGREAT) {
            this.match(TokenType.EGREAT);
            rel_op.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.EGREAT
            });
            return rel_op;
        }

        if (this.currentToken.type === TokenType.ELESS) {
            this.match(TokenType.ELESS);
            rel_op.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.ELESS
            });
            return rel_op;
        }

        this.error();
        return rel_op;
    }

    id(): id {
        const { value } = this.match(TokenType.IDENITIFIER)!;
        return {
            type: "Id",
            childrens: [{
                type: 'Terminal',
                childrens: [],
                value
            }]
        }
    }

    digit(): Digit {
        const { value } = this.match(TokenType.INTEGER)!;
        return {
            type: "Digit",
            childrens: [{
                type: 'Terminal',
                childrens: [],
                value
            }]
        }
    }

    stmts(): Stmts {
        const childs: _Node[] = [];


        while (this.currentToken.type !== TokenType.RBRAC && this.currentToken.type !== TokenType.EOF ) {
            childs.push(this.stmt()!);
        }

        return {
            type: "Stmts",
            childrens: childs
        };
    }

    assign(): Assign_stmt {
        const childs: _Node[] = [];

        this.match(TokenType.LET);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: 'let'
        })

        childs.push(this.id());

        this.match(TokenType.ASSIGN);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: '='
        })

        childs.push(this.expr());

        this.match(TokenType.SEMI);
        childs.push({
            type: 'Terminal',
            childrens: [],
            value: ';'
        })

        return {
            type: "Assign_stmt",
            childrens: childs
        }
    }

    expr(): Expr {

        const childs: _Node[] = [];

        childs.push(this.term());
        childs.push(this.rest());

        return {
            type: 'Expr',
            childrens: childs
        }
    }

    rest(): Rest {
        const rest: Rest = {
            type: "Rest",
            childrens: []
        }

        if (this.currentToken.type === TokenType.PLUS) {
            this.match(TokenType.PLUS);
            rest.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.PLUS
            })

            rest.childrens.push(this.term());
            rest.childrens.push(this.rest());
            return rest;
        }

        if (this.currentToken.type === TokenType.MINUS) {
            this.match(TokenType.PLUS);
            rest.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.MINUS
            })

            rest.childrens.push(this.term());
            rest.childrens.push(this.rest());
            return rest;
        }

        return rest;
    }

    term(): Term {
        const childs: _Node[] = [];

        childs.push(this.factor());
        childs.push(this.rest1());

        return {
            type: "Term",
            childrens: childs
        }
    }

    factor(): Factor {

        const factor: Factor = {
            type: "Factor",
            childrens: []
        }

        if (this.currentToken.type === TokenType.INTEGER) {
            factor.childrens.push(this.digit());
            return factor;
        }

        if (this.currentToken.type === TokenType.IDENITIFIER) {
            factor.childrens.push(this.id());
            return factor;
        }

        if (this.currentToken.type === TokenType.LPRAN) {
            this.match(TokenType.LPRAN);
            factor.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.LPRAN
            });

            factor.childrens.push(this.expr());

            this.match(TokenType.RPRAN);
            factor.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.RPRAN
            });

            return factor;
        }

        this.error();
        return factor;
    }

    rest1(): Rest1 {
        const rest1: Rest1 = {
            type: "Rest1",
            childrens: []
        }

        if (this.currentToken.type === TokenType.MUL) {
            this.match(TokenType.MUL);
            rest1.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.MUL
            })

            rest1.childrens.push(this.factor());
            rest1.childrens.push(this.rest1());
            return rest1;
        }

        if (this.currentToken.type === TokenType.DIV) {
            this.match(TokenType.DIV);
            rest1.childrens.push({
                type: 'Terminal',
                childrens: [],
                value: TokenType.DIV
            })

            rest1.childrens.push(this.factor());
            rest1.childrens.push(this.rest1());
            return rest1;
        }

        return rest1;
    }

}