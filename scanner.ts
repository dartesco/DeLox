import TokenType from './token-type.ts';
import Token from './token.ts';
import { error } from './index.ts';
import { Literal } from './utils.ts';

export default class Scanner {
  private readonly source: string;
  private readonly tokens: Token[];
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;

  constructor(source: string) {
    this.source = source;
    this.tokens = new Array<Token>();
  }

  // Loop to scan for all tokens in the source
  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  // Self-explanatory
  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  // Consumes the character and outputs the right type (or errors) 
  private scanToken(): void {
    const c: string = this.advance();
    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '{': this.addToken(TokenType.LEFT_BRACE); break;
      case '}': this.addToken(TokenType.RIGHT_BRACE); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case ';': this.addToken(TokenType.SEMICOLON); break;
      case '*': this.addToken(TokenType.STAR); break;
      case '!': this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG); break;
      case '=': this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); break;
      case '<': this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS); break;
      case '>': this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER); break;
      case '/':
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case '"': this.string(); break;
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n': this.line++; break;
      default: error(this.line, `Unexpected character '${c}'`); break;
    }
  }

  // Returns the next character to consume
  private advance(): string {
    return this.source.charAt(this.current++);
  }

  // Consumes the next character only if it matches the expected param
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;

    this.current++;
    return true;
  }

  // Look-ahead 1 char (no consuming)
  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  private addToken(type: TokenType): void;
  private addToken(type: TokenType, literal: Literal): void;
  
  private addToken(type: TokenType, literal?: Literal): void {
    const text: string = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, (literal == undefined ? null : literal), this.line));
  }

  private string(): void {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      error(this.line, "Unterminated string.");
      return;
    }

    this.advance();
    
    const value: string = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }
};