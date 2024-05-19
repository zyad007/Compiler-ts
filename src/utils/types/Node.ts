import { TokenType } from "../enums/TokenType";

export interface _Node  {
    type: string,
    childrens: _Node[],
    value?: string
}

export interface Program extends _Node {
    type: 'Program'
}

export interface Stmt extends _Node {
    type: 'Stmt'
}

export interface Assign_stmt extends _Node {
    type: 'Assign_stmt'
}

export interface If_stmt extends _Node {
    type: 'If_stmt'
}

export interface Expr extends _Node {
    type: 'Expr'
}

export interface While_stmt extends _Node {
    type: 'While_stmt'
}

export interface Term extends _Node {
    type: 'Term'
}

export interface Rest extends _Node {
    type: 'Rest'
}

export interface Rest1 extends _Node {
    type: 'Rest1'
}

export interface Factor extends _Node {
    type: 'Factor'
}

export interface Rest1 extends _Node {
    type: 'Rest1'
}

export interface Digit extends _Node {
    type: 'Digit'
}

export interface Cond extends _Node {
    type: 'Cond'
}

export interface id extends _Node {
    type: 'Id'
}

export interface Terminal extends _Node {
    type: 'Terminal'
}

export interface Rel_op extends _Node {
    type: 'Rel_op'
}

export interface Stmts extends _Node {
    type: 'Stmts'
}