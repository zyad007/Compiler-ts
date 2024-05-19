export enum TokenType {

    // Variables
    IDENITIFIER = 'IDENITIFIER',
    
    // Key words
    LET = 'let',
    WHILE = 'while',
    IF = 'if',
    ELSE = 'else',
    IMPORT = 'import',
    
    // Types
    INTEGER = 'INTEGER',
    STRING = 'STRING',

    // Boolean Op
    EQUAL = '==',
    NOT = '!=',
    GREAT = '>',
    LESS = '<',
    EGREAT = '>=',
    ELESS = '<=',

    // Assign
    ASSIGN = '=',

    // Arthimitic Op
    PLUS = '+',
    MINUS = '-',
    MUL = '*',
    DIV = '/',
    
    // Scopes
    LPRAN = '(',
    RPRAN = ')',
    LBRAC = '{',
    RBRAC = '}',

    // End 
    SEMI = ';',
    EOF = 'EOF',
    ILLEGAL = 'ILLEGAL'
}