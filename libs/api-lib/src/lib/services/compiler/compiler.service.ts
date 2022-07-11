import { Injectable } from '@nestjs/common';
import * as chevrotain from 'chevrotain';

@Injectable()
export class CompilerService {
    
    compile(input:string):string{
        return "compile " + input;
    }

    defineAllTokenTypes(): chevrotain.TokenType[]{
        const result:chevrotain.TokenType[] = []

        // class and function declaration
        result.push(chevrotain.createToken({name:"Class",pattern:/class/}));
        result.push(chevrotain.createToken({name:"Class",pattern:/func/}));
        
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

        //arithmetic operators
        result.push(chevrotain.createToken({name:"Plus",pattern:/\+/}));
        result.push(chevrotain.createToken({name:"Minus",pattern:/-/ }));
        result.push(chevrotain.createToken({name:"Multiply",pattern:/\*/}));
        result.push(chevrotain.createToken({name:"Divide",pattern:/\\/}));
        result.push(chevrotain.createToken({name:"Mod",pattern:/mod/}));

        //logical operators
        result.push(chevrotain.createToken({name:"And",pattern:/and/}));
        result.push(chevrotain.createToken({name:"Or",pattern:/or/ }));
        result.push(chevrotain.createToken({name:"Not",pattern:/not/}));

        //relation operators
        result.push(chevrotain.createToken({name:"GreaterThan",pattern:/>/}));
        result.push(chevrotain.createToken({name:"LessThan",pattern:/</ }));
        result.push(chevrotain.createToken({name:"GreaterThanOrEqual",pattern:/>=/}));
        result.push(chevrotain.createToken({name:"LessThanOrEqual",pattern:/<=/}));
        result.push(chevrotain.createToken({name:"Equal",pattern:/==/}));

        //Assignment operators
        result.push(chevrotain.createToken({name:"Assign",pattern:/=/}));
        result.push(chevrotain.createToken({name:"PlusAssign",pattern:/\+=/ }));
        result.push(chevrotain.createToken({name:"MinusAssign",pattern:/-=/}));
        result.push(chevrotain.createToken({name:"DivideAssign",pattern:/\\=/}));
        result.push(chevrotain.createToken({name:"MultiplyAssign",pattern:/\*=/ }));

        //increment
        result.push(chevrotain.createToken({name:"Increment",pattern:/\+\+/}));

        //decrement
        result.push(chevrotain.createToken({name:"Decrement",pattern:/--/ }));

        //datatypes
        result.push(chevrotain.createToken({name:"Boolean",pattern:/boolean/}));
        result.push(chevrotain.createToken({name:"Integer",pattern:/integer/ }));
        result.push(chevrotain.createToken({name:"Float",pattern:/float/}));
        result.push(chevrotain.createToken({name:"String",pattern:/string/}));
        result.push(chevrotain.createToken({name:"String",pattern:/void/}));

        //literals
        result.push(chevrotain.createToken({name:"IntegerLiteral",pattern:/0|-?[1-9][1-9]*/}));
        result.push(chevrotain.createToken({name:"StringLiteral",pattern:/("[A-Za-z0-9]*") | ('[A-Za-z0-9]*')/ }));
        result.push(chevrotain.createToken({name:"FloatLiteral",pattern:/[+-]?([1-9]+[0-9]*\.?[0-9]*|0?\.[0-9]+)$/}));
        result.push(chevrotain.createToken({name:"False",pattern:/false/}));
        result.push(chevrotain.createToken({name:"True",pattern:/true/}));
        
        //user defined identifier
        result.push(chevrotain.createToken({name:"UserDefinedIdentifier",pattern:/[a-zA-Z_]+[a-zA-Z0-9]*/}));
        
        //input output
        result.push(chevrotain.createToken({name:"Input",pattern:/input/}));
        result.push(chevrotain.createToken({name:"Output",pattern:/output/}));
        result.push(chevrotain.createToken({name:"Read",pattern:/read/}));

        //loops
        result.push(chevrotain.createToken({name:"While",pattern:/while/}));
        result.push(chevrotain.createToken({name:"For",pattern:/for/}));
        result.push(chevrotain.createToken({name:"do",pattern:/do/}));

        //branch
        result.push(chevrotain.createToken({name:"If",pattern:/if/}));
        result.push(chevrotain.createToken({name:"Else",pattern:/else/}));

        //flow control
        result.push(chevrotain.createToken({name:"Break",pattern:/break/}));
        result.push(chevrotain.createToken({name:"Continue",pattern:/continue/}));

        //presets
        result.push(chevrotain.createToken({name:"Minmax",pattern:/minmax/}));
        result.push(chevrotain.createToken({name:"CreateDecisionTreeModel",pattern:/decision_tree.createModel/}));
        result.push(chevrotain.createToken({name:"NeuralNetworkOptions",pattern:/neural_network.options/}));
        result.push(chevrotain.createToken({name:"NeuralNetworkTrainingData",pattern:/neural_network.training_data/}));
        result.push(chevrotain.createToken({name:"NeuralNetworkNormilize",pattern:/neural_network.normilize/}));

        //instantiate
        result.push(chevrotain.createToken({name:"New",pattern:/new/}));

        //whitespace
        result.push(chevrotain.createToken({name:"WhiteSpace",pattern:/\s+/,group: chevrotain.Lexer.SKIPPED}));

        //comments
        result.push(chevrotain.createToken({name:"WhiteSpace",pattern:/\/\*[a-zA-Z0-9]*\*\//,group: chevrotain.Lexer.SKIPPED}));
        
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
