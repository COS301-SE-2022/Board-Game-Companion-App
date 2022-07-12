import { Injectable } from '@nestjs/common';
import * as chevrotain from 'chevrotain';

@Injectable()
export class CompilerService {
    
    compile(input:string):string{
        return "compile " + input;
    }

    defineAllTokenTypes(): chevrotain.TokenType[]{
        const result:chevrotain.TokenType[] = []

        //user defined identifier
        const tUserDefinedIdentifier = chevrotain.createToken({name:"UserDefinedIdentifier",pattern:/[a-zA-Z_]+[a-zA-Z0-9]*/});
        // class and function declaration
        result.push(chevrotain.createToken({name:"Class",pattern:/class/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Function",pattern:/func/,longer_alt:tUserDefinedIdentifier}));
        
        //punctuation
        result.push(chevrotain.createToken({name:"Comma",pattern:/,/}));
        result.push(chevrotain.createToken({name:"OpenBracket",pattern:/\(/ }));
        result.push(chevrotain.createToken({name:"CloseBracket",pattern:/\)/}));
        result.push(chevrotain.createToken({name:"OpenBrace",pattern:/{/}));
        result.push(chevrotain.createToken({name:"CloseBrace",pattern:/}/}));
        result.push(chevrotain.createToken({name:"Colon",pattern:/:/}));
        result.push(chevrotain.createToken({name:"OpenSquareBracket",pattern:/\[/}));
        result.push(chevrotain.createToken({name:"ClosedSquareBracket",pattern:/\]/}));
        result.push(chevrotain.createToken({name:"QuestionMark",pattern:/\?/}));

        //relational operators
        const tGreaterThanOrEqual = chevrotain.createToken({name:"GreaterThanOrEqual",pattern:/>=/});
        const tLessThanOrEqual = chevrotain.createToken({name:"LessThanOrEqual",pattern:/<=/});
        const tEqual = chevrotain.createToken({name:"Equal",pattern:/==/});
        result.push(chevrotain.createToken({name:"GreaterThan",pattern:/>/,longer_alt:tGreaterThanOrEqual}));
        result.push(chevrotain.createToken({name:"LessThan",pattern:/</,longer_alt:tLessThanOrEqual}));

        //Assignment operators
        result.push(chevrotain.createToken({name:"Assign",pattern:/=/,longer_alt:tEqual}));
        const tPlusAssign = chevrotain.createToken({name:"PlusAssign",pattern:/\+=/ });
        const tMinusAssign = chevrotain.createToken({name:"MinusAssign",pattern:/-=/});
        const tDivideAssign = chevrotain.createToken({name:"DivideAssign",pattern:/\\=/});
        const tMultiplyAssign = chevrotain.createToken({name:"MultiplyAssign",pattern:/\*=/ });

        //increment
        const tIncrement = chevrotain.createToken({name:"Increment",pattern:/\+\+/});

        //decrement
        const tDecrement = chevrotain.createToken({name:"Decrement",pattern:/--/ });
        
        //arithmetic operators
        result.push(chevrotain.createToken({name:"Plus",pattern:/\+/,longer_alt:[tIncrement,tPlusAssign]}));
        result.push(chevrotain.createToken({name:"Minus",pattern:/-/,longer_alt:[tDecrement,tMinusAssign]}));
        result.push(chevrotain.createToken({name:"Multiply",pattern:/\*/,longer_alt:tMultiplyAssign}));
        result.push(chevrotain.createToken({name:"Divide",pattern:/\\/,longer_alt:tDivideAssign}));
        result.push(chevrotain.createToken({name:"Mod",pattern:/mod/,longer_alt:tUserDefinedIdentifier}));

        //logical operators
        result.push(chevrotain.createToken({name:"And",pattern:/and/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Or",pattern:/or/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Not",pattern:/not/,longer_alt:tUserDefinedIdentifier}));


        //datatypes
        result.push(chevrotain.createToken({name:"Boolean",pattern:/boolean/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Integer",pattern:/integer/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Float",pattern:/float/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"String",pattern:/string/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"String",pattern:/void/,longer_alt:tUserDefinedIdentifier}));

        //literals
        const tFloatLiteral = chevrotain.createToken({name:"FloatLiteral",pattern:/-?([1-9]+[0-9]*\.?[0-9]*|0?\.[0-9]+)/});
        

        result.push(chevrotain.createToken({name:"IntegerLiteral",pattern:/0|-?[1-9][1-9]*/,longer_alt:tFloatLiteral}));
        result.push(chevrotain.createToken({name:"StringLiteral",pattern:/("[A-Za-z0-9]*") | ('[A-Za-z0-9]*')/ }));
        result.push(chevrotain.createToken({name:"False",pattern:/false/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"True",pattern:/true/,longer_alt:tUserDefinedIdentifier}));
        
        
        //input output
        result.push(chevrotain.createToken({name:"Input",pattern:/input/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Output",pattern:/output/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Read",pattern:/read/,longer_alt:tUserDefinedIdentifier}));

        //loops
        result.push(chevrotain.createToken({name:"While",pattern:/while/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"For",pattern:/for/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"do",pattern:/do/,longer_alt:tUserDefinedIdentifier}));

        //branch
        result.push(chevrotain.createToken({name:"If",pattern:/if/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Else",pattern:/else/,longer_alt:tUserDefinedIdentifier}));

        //flow control
        result.push(chevrotain.createToken({name:"Break",pattern:/break/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Continue",pattern:/continue/,longer_alt:tUserDefinedIdentifier}));

        //presets
        result.push(chevrotain.createToken({name:"Minmax",pattern:/minmax/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"CreateDecisionTreeModel",pattern:/decision_tree.createModel/}));
        result.push(chevrotain.createToken({name:"NeuralNetworkOptions",pattern:/neural_network.options/}));
        result.push(chevrotain.createToken({name:"NeuralNetworkTrainingData",pattern:/neural_network.training_data/}));
        result.push(chevrotain.createToken({name:"NeuralNetworkNormilize",pattern:/neural_network.normilize/}));

        //instantiate
        result.push(chevrotain.createToken({name:"New",pattern:/new/,longer_alt:tUserDefinedIdentifier}));

        //whitespace
        result.push(chevrotain.createToken({name:"WhiteSpace",pattern:/\s+/,group: chevrotain.Lexer.SKIPPED}));

        //comments
        result.push(chevrotain.createToken({name:"WhiteSpace",pattern:/\/\*[a-zA-Z0-9]*\*\//,group: chevrotain.Lexer.SKIPPED}));
        
        
        result.push(tUserDefinedIdentifier);
        result.push(tGreaterThanOrEqual);
        result.push(tLessThanOrEqual);
        result.push(tEqual);
        result.push(tPlusAssign);
        result.push(tMinusAssign);
        result.push(tDivideAssign);
        result.push(tMultiplyAssign);
        result.push(tIncrement);
        result.push(tDecrement);
        result.push(tFloatLiteral);

        return result;
    }

    scan(input:string):chevrotain.ILexingResult{
        const tokens:chevrotain.TokenType[] = this.defineAllTokenTypes(); 
        const lexer = new chevrotain.Lexer(tokens);
        
        return lexer.tokenize(input);
    }

    parse(input:string):string{
        return "parse " + input;
    }
}
