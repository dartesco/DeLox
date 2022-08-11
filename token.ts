import TokenType from "./token-type.ts";
import { Literal } from "./utils.ts";

export default class Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly literal: Literal;
  readonly line: number;

  constructor(type: TokenType, lexeme: string, literal: Literal, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  public toString(): string {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
