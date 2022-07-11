import { Injectable } from '@nestjs/common';
import * as chevrotain from 'chevrotain';

@Injectable()
export class CompilerService {
    
    compile(input:string):string{
        return "compile " + input;
    }

    scan(input:string):chevrotain.ILexingResult{
        const Integer = chevrotain.createToken({name:"Integer",pattern:/0|[1-9]\d*/});
        const Operator = chevrotain.createToken({name:"Operator",pattern:/\+/});
        const WhiteSpace = chevrotain.createToken({name: "WhiteSpace",pattern: /\s+/,group: chevrotain.Lexer.SKIPPED});
        const allTokens:chevrotain.TokenType[] = [
            Integer,
            Operator,
            WhiteSpace
        ];
        const lexer = new chevrotain.Lexer(allTokens);
        
        return lexer.tokenize(input);
    }

    parse(input:string):string{
        return "parse " + input;
    }
}
