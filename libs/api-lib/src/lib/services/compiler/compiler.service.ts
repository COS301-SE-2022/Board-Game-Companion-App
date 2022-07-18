import { Injectable } from '@nestjs/common';
import * as chevrotain from 'chevrotain';
import { CstNode, CstParser, ParserMethod } from 'chevrotain';
import { lexerResult } from '../../models/general/lexerResult';

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
        result.push(chevrotain.createToken({name:"Class",pattern:/card/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Action",pattern:/action/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Parameters",pattern:/parameters/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Condition",pattern:/condition/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Effect",pattern:/effect/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"State",pattern:/state/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Turn",pattern:/turn/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Player",pattern:/player/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Endgame",pattern:/endgame/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Return",pattern:/return/,longer_alt:tUserDefinedIdentifier}));

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
        result.push(chevrotain.createToken({name:"SemiColon",pattern:/;/}));
        result.push(chevrotain.createToken({name:"Dot",pattern:/./}));

        //relational operators
        const tGreaterThanOrEqual = chevrotain.createToken({name:"GreaterThanOrEqual",pattern:/>=/});
        const tLessThanOrEqual = chevrotain.createToken({name:"LessThanOrEqual",pattern:/<=/});
        const tEqual = chevrotain.createToken({name:"Equal",pattern:/==/});
        result.push(tGreaterThanOrEqual);
        result.push(tLessThanOrEqual);
        result.push(tEqual);
        result.push(chevrotain.createToken({name:"GreaterThan",pattern:/>/,longer_alt:tGreaterThanOrEqual}));
        result.push(chevrotain.createToken({name:"LessThan",pattern:/</,longer_alt:tLessThanOrEqual}));

        //Assignment operators
        result.push(chevrotain.createToken({name:"Assign",pattern:/=/,longer_alt:tEqual}));

        //increment
        const tIncrement = chevrotain.createToken({name:"Increment",pattern:/\+\+/});

        //decrement
        const tDecrement = chevrotain.createToken({name:"Decrement",pattern:/--/ });
        
        result.push(tIncrement);
        result.push(tDecrement);
        //arithmetic operators
        result.push(chevrotain.createToken({name:"Plus",pattern:/\+/,longer_alt:tIncrement}));
        result.push(chevrotain.createToken({name:"Minus",pattern:/-/,longer_alt:tDecrement}));
        result.push(chevrotain.createToken({name:"Multiply",pattern:/\*/}));
        result.push(chevrotain.createToken({name:"Divide",pattern:/\\/}));
        result.push(chevrotain.createToken({name:"Mod",pattern:/mod/,longer_alt:tUserDefinedIdentifier}));

        //logical operators
        result.push(chevrotain.createToken({name:"And",pattern:/and/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Or",pattern:/or/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Not",pattern:/not/,longer_alt:tUserDefinedIdentifier}));

        //literals
        const tFloatLiteral = chevrotain.createToken({name:"FloatLiteral",pattern:/-?([1-9]+[0-9]*\.?[0-9]*|0?\.[0-9]+)/});
        

        result.push(chevrotain.createToken({name:"IntegerLiteral",pattern:/0|-?[1-9][1-9]*/,longer_alt:tFloatLiteral}));
        result.push(chevrotain.createToken({name:"StringLiteral",pattern:/("[A-Za-z0-9]*") | ('[A-Za-z0-9]*')/ }));
        result.push(chevrotain.createToken({name:"False",pattern:/false/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"True",pattern:/true/,longer_alt:tUserDefinedIdentifier}));
        
        
        //input output
        result.push(chevrotain.createToken({name:"Input",pattern:/input/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Print",pattern:/print/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"Read",pattern:/read/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"ConsoleInput",pattern:/console.input/,longer_alt:tUserDefinedIdentifier}));
        result.push(chevrotain.createToken({name:"ConsoleOutput",pattern:/console.print/,longer_alt:tUserDefinedIdentifier}));

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
        result.push(chevrotain.createToken({name:"NeuralNetwork",pattern:/neuralnetwork/}));

        //variable
        result.push(chevrotain.createToken({name:"Variable",pattern:/var/,longer_alt:tUserDefinedIdentifier}));

        //whitespace
        result.push(chevrotain.createToken({name:"WhiteSpace",pattern:/\s+/,group: chevrotain.Lexer.SKIPPED}));

        //comments
        result.push(chevrotain.createToken({name:"WhiteSpace",pattern:/\/\*[a-zA-Z0-9]*\*\//,group: chevrotain.Lexer.SKIPPED}));
        
        
        result.push(tUserDefinedIdentifier);
        result.push(tFloatLiteral);

        return result;
    }

    scanHelper(input:string):chevrotain.ILexingResult{
        const tokens:chevrotain.TokenType[] = this.defineAllTokenTypes(); 
        const lexer = new chevrotain.Lexer(tokens);
        
        return lexer.tokenize(input);
    }

    scan(input:string):lexerResult{
        const tokens:chevrotain.ILexingResult = this.scanHelper(input);
        const result:lexerResult = {
            success: true,
            errors: []
        }

        if(tokens.errors.length !== 0){
            result.success = false;
            result.errors = tokens.errors;
        }

        return result;
    }

    parse(input:string):string{
        
        return "parse " + input;
    }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
class parser extends CstParser
{
    //user defined identifier
tUserDefinedIdentifier = chevrotain.createToken({name:"UserDefinedIdentifier",pattern:/[a-zA-Z_]+[a-zA-Z0-9]*/});
// class and function declaration
Class = chevrotain.createToken({name:"Class",pattern:/card/,longer_alt:this.tUserDefinedIdentifier});
tAction =(chevrotain.createToken({name:"Action",pattern:/action/,longer_alt:this.tUserDefinedIdentifier}));
tParameters =(chevrotain.createToken({name:"Parameters",pattern:/parameters/,longer_alt:this.tUserDefinedIdentifier}));
tCondition=(chevrotain.createToken({name:"Condition",pattern:/condition/,longer_alt:this.tUserDefinedIdentifier}));
tEffect=(chevrotain.createToken({name:"Effect",pattern:/effect/,longer_alt:this.tUserDefinedIdentifier}));
tState=(chevrotain.createToken({name:"State",pattern:/state/,longer_alt:this.tUserDefinedIdentifier}));
Turn=(chevrotain.createToken({name:"Turn",pattern:/turn/,longer_alt:this.tUserDefinedIdentifier}));
tPlayer=(chevrotain.createToken({name:"Player",pattern:/player/,longer_alt:this.tUserDefinedIdentifier}));
tEndgame=(chevrotain.createToken({name:"Endgame",pattern:/endgame/,longer_alt:this.tUserDefinedIdentifier}));
tReturn=(chevrotain.createToken({name:"Return",pattern:/return/,longer_alt:this.tUserDefinedIdentifier}));

//punctuation
Comma=(chevrotain.createToken({name:"Comma",pattern:/,/}));
OpenBracket=(chevrotain.createToken({name:"OpenBracket",pattern:/\(/ }));
CloseBracket=(chevrotain.createToken({name:"CloseBracket",pattern:/\)/}));
OpenBrace=(chevrotain.createToken({name:"OpenBrace",pattern:/{/}));
CloseBrace=(chevrotain.createToken({name:"CloseBrace",pattern:/}/}));
Colon=(chevrotain.createToken({name:"Colon",pattern:/:/}));
OpenSquareBracket=(chevrotain.createToken({name:"OpenSquareBracket",pattern:/\[/}));
ClosedSquareBracket=(chevrotain.createToken({name:"ClosedSquareBracket",pattern:/\]/}));
QuestionMark=(chevrotain.createToken({name:"QuestionMark",pattern:/\?/}));
SemiColon=(chevrotain.createToken({name:"SemiColon",pattern:/;/}));

//relational operators
tGreaterThanOrEqual = chevrotain.createToken({name:"GreaterThanOrEqual",pattern:/>=/});
tLessThanOrEqual = chevrotain.createToken({name:"LessThanOrEqual",pattern:/<=/});
tEqual = chevrotain.createToken({name:"Equal",pattern:/==/});
GreaterThan=(chevrotain.createToken({name:"GreaterThan",pattern:/>/,longer_alt:this.tGreaterThanOrEqual}));
LessThan=(chevrotain.createToken({name:"LessThan",pattern:/</,longer_alt:this.tLessThanOrEqual}));

//Assignment operators
Assign=(chevrotain.createToken({name:"Assign",pattern:/=/,longer_alt:this.tEqual}));

//increment
tIncrement = chevrotain.createToken({name:"Increment",pattern:/\+\+/});

//decrement
tDecrement = chevrotain.createToken({name:"Decrement",pattern:/--/ });

//arithmetic operators
Plus=(chevrotain.createToken({name:"Plus",pattern:/\+/,longer_alt:this.tIncrement}));
Minus=(chevrotain.createToken({name:"Minus",pattern:/-/,longer_alt:this.tDecrement}));
Multiply=(chevrotain.createToken({name:"Multiply",pattern:/\*/}));
Divide=(chevrotain.createToken({name:"Divide",pattern:/\\/}));
Mod=(chevrotain.createToken({name:"Mod",pattern:/mod/,longer_alt:this.tUserDefinedIdentifier}));

//logical operators
And=(chevrotain.createToken({name:"And",pattern:/and/,longer_alt:this.tUserDefinedIdentifier}));
Or=(chevrotain.createToken({name:"Or",pattern:/or/,longer_alt:this.tUserDefinedIdentifier}));
Not=(chevrotain.createToken({name:"Not",pattern:/not/,longer_alt:this.tUserDefinedIdentifier}));

//literals
tFloatLiteral = chevrotain.createToken({name:"FloatLiteral",pattern:/-?([1-9]+[0-9]*\.?[0-9]*|0?\.[0-9]+)/});


IntegerLiteral=(chevrotain.createToken({name:"IntegerLiteral",pattern:/0|-?[1-9][1-9]*/,longer_alt:this.tFloatLiteral}));
StringLiteral=(chevrotain.createToken({name:"StringLiteral",pattern:/("[A-Za-z0-9]*") | ('[A-Za-z0-9]*')/ }));
False=(chevrotain.createToken({name:"False",pattern:/false/,longer_alt:this.tUserDefinedIdentifier}));
True=(chevrotain.createToken({name:"True",pattern:/true/,longer_alt:this.tUserDefinedIdentifier}));


//input output
Input=(chevrotain.createToken({name:"Input",pattern:/input/,longer_alt:this.tUserDefinedIdentifier}));
Print=(chevrotain.createToken({name:"Print",pattern:/print/,longer_alt:this.tUserDefinedIdentifier}));
Read=(chevrotain.createToken({name:"Read",pattern:/read/,longer_alt:this.tUserDefinedIdentifier}));
ConsoleInput=(chevrotain.createToken({name:"ConsoleInput",pattern:/console.input/,longer_alt:this.tUserDefinedIdentifier}));
ConsoleOutput=(chevrotain.createToken({name:"ConsoleOutput",pattern:/console.print/,longer_alt:this.tUserDefinedIdentifier}));

//loops
While=(chevrotain.createToken({name:"While",pattern:/while/,longer_alt:this.tUserDefinedIdentifier}));
For=(chevrotain.createToken({name:"For",pattern:/for/,longer_alt:this.tUserDefinedIdentifier}));
Do=(chevrotain.createToken({name:"do",pattern:/do/,longer_alt:this.tUserDefinedIdentifier}));

//branch
If=(chevrotain.createToken({name:"If",pattern:/if/,longer_alt:this.tUserDefinedIdentifier}));
Else=(chevrotain.createToken({name:"Else",pattern:/else/,longer_alt:this.tUserDefinedIdentifier}));

//flow control
Break=(chevrotain.createToken({name:"Break",pattern:/break/,longer_alt:this.tUserDefinedIdentifier}));
Continue=(chevrotain.createToken({name:"Continue",pattern:/continue/,longer_alt:this.tUserDefinedIdentifier}));

//presets
Minmax=(chevrotain.createToken({name:"Minmax",pattern:/minmax/,longer_alt:this.tUserDefinedIdentifier}));
NeuralNetwork=(chevrotain.createToken({name:"NeuralNetwork",pattern:/neuralnetwork/}));

//variable
tVariable=(chevrotain.createToken({name:"Variable",pattern:/var/,longer_alt:this.tUserDefinedIdentifier}));

//whitespace
WhiteSpace=(chevrotain.createToken({name:"WhiteSpace",pattern:/\s+/,group: chevrotain.Lexer.SKIPPED}));

//comments
Coment=(chevrotain.createToken({name:"WhiteSpace",pattern:/\/\*[a-zA-Z0-9]*\*\//,group: chevrotain.Lexer.SKIPPED}));




    AllTokens = [
        this.tUserDefinedIdentifier,
        this.Class,
        this.tAction,
        this.tParameters,
        this.tCondition,
        this.tEffect,
        this.tState,
        this.Turn,
        this.tPlayer,
        this.tEndgame,
        this.tReturn,
        this.Comma,
        this.OpenBracket,
        this.CloseBracket,
        this.OpenBrace,
        this.CloseBrace,
        this.Colon,
        this.OpenSquareBracket,
        this.ClosedSquareBracket,
        this.QuestionMark,
        this.SemiColon,
        this.tLessThanOrEqual,
        this.tGreaterThanOrEqual,
        this.tEqual,
        this.GreaterThan,
        this.LessThan,
        this.tIncrement,
        this.tDecrement,
        this.Plus,
        this.Minus,
        this.Multiply,
        this.Divide,
        this.Mod,
        this.And,
        this.Or,
        this.Not,
        this.tFloatLiteral,
        this.IntegerLiteral,
        this.StringLiteral,
        this.False,
        this.True,
        this.Input,
        this.Print,
        this.Read,
        this.ConsoleInput,
        this.ConsoleOutput,
        this.While,
        this.For,
        this.Do,
        this.If,
        this.Else,
        this.Break,
        this.Continue,
        this.Minmax,
        this.NeuralNetwork,
        this.tVariable,
        this.WhiteSpace,
        this.Coment,

    ];







    GameState: ParserMethod<unknown[], CstNode>;
    Definition: ParserMethod<unknown[], CstNode>;
    Cards: ParserMethod<unknown[], CstNode>;
    Players: ParserMethod<unknown[], CstNode>;
    End_Game: ParserMethod<unknown[], CstNode>;
    Parameters: ParserMethod<unknown[], CstNode>;
    CardEffect : ParserMethod<unknown[], CstNode>;
    CardCondition: ParserMethod<unknown[], CstNode>;
    TypeList: ParserMethod<unknown[], CstNode>;
    Type: ParserMethod<unknown[], CstNode>;
    statements: ParserMethod<unknown[], CstNode>;
    bool_expr: ParserMethod<unknown[], CstNode>;
    Declarations: ParserMethod<unknown[], CstNode>;
    Actions: ParserMethod<unknown[], CstNode>;
    FormalParameters: ParserMethod<unknown[], CstNode>;
    ActionCondition: ParserMethod<unknown[], CstNode>;
    OtherFormalParameters: ParserMethod<unknown[], CstNode>;
    IO: ParserMethod<unknown[], CstNode>;
    Call: ParserMethod<unknown[], CstNode>;
    Loop: ParserMethod<unknown[], CstNode>;
    Branch: ParserMethod<unknown[], CstNode>;
    Declaration: ParserMethod<unknown[], CstNode>;
    Assignment: ParserMethod<unknown[], CstNode>;
    FlowControl: ParserMethod<unknown[], CstNode>;
    Variable : ParserMethod<unknown[], CstNode>;
    Expression: ParserMethod<unknown[], CstNode>;
    MethodCall:ParserMethod<unknown[], CstNode>;
    Arguments:ParserMethod<unknown[], CstNode>;
    Condition:ParserMethod<unknown[], CstNode>;
    ForLoopInitialiser:ParserMethod<unknown[], CstNode>;
    ForLoopCondition:ParserMethod<unknown[], CstNode>;
    ForLoopStep:ParserMethod<unknown[], CstNode>;
    Alternative:ParserMethod<unknown[], CstNode>;
    Alternative_Branch:ParserMethod<unknown[], CstNode>;
    LHS:ParserMethod<unknown[], CstNode>;
    RHS:ParserMethod<unknown[], CstNode>;
    Unary:ParserMethod<unknown[], CstNode>;
    Binary:ParserMethod<unknown[], CstNode>;
    Ternary:ParserMethod<unknown[], CstNode>;
    Const:ParserMethod<unknown[], CstNode>;
    Unary_Operator:ParserMethod<unknown[], CstNode>;
    Binary_Operator:ParserMethod<unknown[], CstNode>;
    Ternary_Instr :ParserMethod<unknown[], CstNode>;
    Logical_Operator :ParserMethod<unknown[], CstNode>;
    Relational_Operator :ParserMethod<unknown[], CstNode>;
    Field:ParserMethod<unknown[], CstNode>;
    Index:ParserMethod<unknown[], CstNode>;


    constructor() {
        super([]) //should allTokens


        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const $ = this;

        
        
        $.RULE("Program", () => {
            $.SUBRULE($.GameState)
            $.SUBRULE($.Definition)
        });

        $.RULE("Definition", () => {
            $.OPTION(() => {
                $.OR([
                    { ALT: () =>{ $.SUBRULE(this.Cards )
                            $.SUBRULE(this.Definition)}},

                            
                    { ALT: () =>{ $.SUBRULE(this.Players)
                            $.SUBRULE(this.Definition)}},

                    { ALT: () =>{ $.SUBRULE(this.End_Game)
                            $.SUBRULE(this.Definition)}}
                        
                ])
            });
        });
        
        $.RULE("Cards", () => {
            $.CONSUME(this.Class)
            $.CONSUME(this.tUserDefinedIdentifier)
            $.CONSUME(this.OpenBrace)
            $.SUBRULE($.Parameters),
            $.SUBRULE($.CardEffect )
            $.SUBRULE($.CardCondition)
            $.CONSUME(this.CloseBrace)
        });
        $.RULE("Parameters", () => {
            $.CONSUME(this.tParameters )
            $.CONSUME(this.OpenBrace)
            $.SUBRULE($.TypeList)
            $.CONSUME(this.CloseBrace)
        });

        $.RULE("TypeList", () => {
            $.OPTION(() => {
                $.SUBRULE($.Type)
                $.SUBRULE($.TypeList)
            });
        });
        $.RULE("CardCondition", () => {
            $.CONSUME(this.tCondition )
            $.CONSUME(this.OpenBrace)
            $.SUBRULE($.statements)
            $.CONSUME(this.tReturn)
            $.SUBRULE($.bool_expr);
            $.CONSUME(this.CloseBrace)
        });
        $.RULE("CardEffect", () => {
            $.CONSUME(this.tEffect )
            $.CONSUME(this.OpenBrace)
            $.SUBRULE($.statements)
            $.CONSUME(this.CloseBrace)
        });
        $.RULE("Game_State", () => {
            $.CONSUME(this.tState )
            $.CONSUME(this.OpenBrace)
            $.SUBRULE($.Declarations )
            $.CONSUME(this.CloseBrace)
        });
        $.RULE("Players", () => {
            $.CONSUME(this.tPlayer)
            $.CONSUME(this.tUserDefinedIdentifier)
            $.CONSUME(this.OpenBrace)
            $.SUBRULE($.Actions )
            $.CONSUME( this.Turn)
            $.SUBRULE($.statements )
            $.CONSUME(this.CloseBrace)
        });

        $.RULE("Actions", () => {
            $.OPTION(() => {
                
            $.CONSUME(this.tAction)
            $.CONSUME(this.tUserDefinedIdentifier)
            $.CONSUME(this.OpenBracket)
            $.SUBRULE($.FormalParameters)
            $.CONSUME(this.CloseBracket)
            $.CONSUME(this.OpenBrace)  
            $.SUBRULE($.statements )
            $.CONSUME(this.CloseBrace)  
            $.SUBRULE($.ActionCondition )
            $.CONSUME(this.tUserDefinedIdentifier)
            $.CONSUME(this.OpenBracket)
            $.SUBRULE($.FormalParameters)
            $.CONSUME(this.CloseBracket)
            $.CONSUME(this.OpenBrace)
            $.SUBRULE($.statements)
            $.CONSUME(this.tReturn)
            $.SUBRULE($.bool_expr);
            $.CONSUME(this.CloseBrace)
            $.SUBRULE($.Actions);
            });
        });
        $.RULE("FormalParameters", () => {
            $.OPTION(() => {
                $.CONSUME(this.tUserDefinedIdentifier)
                $.SUBRULE($.OtherFormalParameters);
            });
        });
        $.RULE("OtherFormalParameters", () => {
            $.OPTION(() => {
                $.CONSUME(this.tUserDefinedIdentifier)
                $.SUBRULE($.OtherFormalParameters);
            });
        });
        $.RULE("End_Game", () => {
            $.CONSUME(this.tEndgame)
            $.CONSUME(this.OpenBrace)
            $.SUBRULE($.statements)
            $.CONSUME(this.tReturn)
            $.SUBRULE($.bool_expr);
            $.CONSUME(this.CloseBrace)
            $.SUBRULE($.Actions);
        });


        $.RULE("statements", () => {
            $.OPTION(() => {
                $.OR([
                    { ALT: () =>{ $.SUBRULE($.IO )
                            $.SUBRULE($.statements)}},

                            
                    { ALT: () =>{ $.SUBRULE($.Call)
                            $.SUBRULE($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.Loop)
                            $.SUBRULE($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.Branch)
                            $.SUBRULE($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.Declaration )
                            $.SUBRULE($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.Assignment )
                            $.SUBRULE($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.FlowControl )
                            $.SUBRULE($.statements)}},

                    { ALT: () =>{ $.CONSUME(this.tReturn )
                            $.SUBRULE($.Variable )}},
                ])
            });
        });
        $.RULE("IO", () => {
            
                $.OR([
                     
                        { ALT: () =>{ $.CONSUME(this.Input )
                            $.CONSUME(this.OpenBracket )
                            $.CONSUME(this.StringLiteral )
                            $.CONSUME(this.CloseBracket )
                        }},

                        { ALT: () =>{ $.CONSUME(this.Input )
                                $.CONSUME(this.OpenBracket )
                            $.CONSUME(this.StringLiteral  )
                            $.CONSUME(this.Comma )
                            $.SUBRULE($.Variable )
                            $.CONSUME(this.CloseBracket )
                            
                            }},

                        { ALT: () =>{ 
                            $.CONSUME(this.ConsoleInput )
                            $.CONSUME(this.OpenBracket )
                        $.CONSUME(this.StringLiteral )
                        $.CONSUME(this.CloseBracket )
                    }},

                        { ALT: () =>{ $.CONSUME(this.ConsoleInput )
                            $.CONSUME(this.OpenBracket )
                        $.CONSUME(this.StringLiteral )
                        $.CONSUME(this.Comma )
                        $.SUBRULE($.Variable )
                        $.CONSUME(this.CloseBracket )
                        }},

                        { ALT: () =>{ $.CONSUME(this.Print )
                            $.CONSUME(this.OpenBracket )
                            $.SUBRULE($.Expression)
                        $.CONSUME(this.CloseBracket )
                        }},

                        { ALT: () =>{ $.CONSUME(this.ConsoleOutput )
                            $.CONSUME(this.OpenBracket )
                            $.SUBRULE($.Expression)
                        $.CONSUME(this.CloseBracket )
                        }},
                    ])
                    
                });

                $.RULE("Call", () => {
            
                    $.OR([
                    { 
                        ALT: () =>{ 
                        $.CONSUME(this.tUserDefinedIdentifier )
                        $.CONSUME(this.Comma )
                        $.SUBRULE($.MethodCall)
                    }},
                    { 
                        ALT: () =>{ 
                        $.CONSUME(this.Minmax )
                        $.CONSUME(this.OpenBracket )
                        $.CONSUME(this.OpenBrace )
                        $.SUBRULE($.statements)
                        $.CONSUME(this.CloseBrace )
                        $.CONSUME(this.CloseBracket )
                    }},
                    { 
                        ALT: () =>{ 
                        $.CONSUME(this.NeuralNetwork )
                        $.CONSUME(this.OpenBracket )
                        $.CONSUME(this.QuestionMark )
                        $.CONSUME(this.StringLiteral )
                        $.CONSUME(this.QuestionMark )
                        $.CONSUME(this.CloseBracket )
                    }},
                    ])
                    
                });


                $.RULE("MethodCall", () => {
            
                    $.OR([

                        { 
                            ALT: () =>{ 
                            $.CONSUME(this.tEffect )
                            $.CONSUME(this.OpenBracket )
                            $.SUBRULE($.Arguments )
                            $.CONSUME(this.CloseBracket )
                        }},
                        { 
                            ALT: () =>{ 
                                $.CONSUME(this.tCondition )
                                $.CONSUME(this.OpenBracket )
                                $.SUBRULE($.Arguments )
                                $.CONSUME(this.CloseBracket )
                        }},

                    ])
                    
                });
                $.RULE("Loop", () => {
            
                    $.OR([

                        { 
                            ALT: () =>{ 
                            $.CONSUME(this.While )
                            $.CONSUME(this.OpenBracket )
                            $.SUBRULE($.Condition)
                            $.CONSUME(this.CloseBracket )
                            $.CONSUME(this.OpenBrace )
                            $.SUBRULE($.statements)
                            $.CONSUME(this.CloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                $.CONSUME(this.For )
                                $.CONSUME(this.OpenBracket )
                                $.SUBRULE($.ForLoopInitialiser )
                                $.CONSUME(this.SemiColon )
                                $.SUBRULE($.ForLoopCondition )
                                $.CONSUME(this.SemiColon )
                                $.SUBRULE($.ForLoopStep )
                                $.CONSUME(this.CloseBracket )
                                $.CONSUME(this.OpenBrace )
                                $.SUBRULE($.statements)
                                $.CONSUME(this.CloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                $.CONSUME(this.Do )
                                $.CONSUME(this.OpenBrace )
                                $.SUBRULE($.statements )
                                $.CONSUME(this.CloseBrace )
                                $.CONSUME(this.While )
                                $.CONSUME(this.OpenBracket )
                                $.SUBRULE($.Condition )
                                $.CONSUME(this.CloseBracket )
                        }},
                    ])
                    
                });

                $.RULE("ForLoopInitialiser", () => {
                    $.OPTION(() => {
                        $.SUBRULE($.Variable)
                    })
                });


                $.RULE("ForLoopCondition", () => {
                    
                   $.SUBRULE($.Condition)
                    
                });
                $.RULE("ForLoopStep", () => {
                    
                    $.SUBRULE($.Expression)
                     
                 });
                 $.RULE("Branch", () => {
                    $.CONSUME(this.If )
                    $.CONSUME(this.OpenBracket )
                    $.SUBRULE($.Condition)
                    $.CONSUME(this.CloseBracket )
                    $.CONSUME(this.OpenBrace )
                    $.SUBRULE($.statements)
                    $.CONSUME(this.CloseBrace )
                    $.SUBRULE($.Alternative)


                 });
                 $.RULE("Alternative_Branch ", () => {
                    $.OR([
                        { 
                            ALT: () =>{ 
                            $.SUBRULE($.Branch)
                        }},
                        { 
                            ALT: () =>{ 
                            $.CONSUME(this.OpenBrace )
                            $.SUBRULE($.statements)
                            $.CONSUME(this.CloseBrace )
                        }},
                    ])
                 });
                 $.RULE("Declarations", () => {
                    $.OPTION(() => {
                        $.OR([
                            { 
                                ALT: () =>{ 
                                $.SUBRULE($.Declaration )
                                $.SUBRULE($.Declarations )
                            }},
                            { 
                                ALT: () =>{ 
                                $.CONSUME(this.tVariable)
                                $.SUBRULE($.Variable )
                            }}
                ])


                 });

                });


                 $.RULE("Assignment", () => {
                    
                    $.SUBRULE($.LHS )
                    $.CONSUME(this.tEqual)
                    $.SUBRULE($.RHS )
                 });

                 $.RULE("LHS", () => {
                    
                    $.SUBRULE($.Variable )
                 });

                 $.RULE("RHS", () => {
                    
                        $.OR([
                            { 
                                ALT: () =>{ 
                                $.SUBRULE($.Expression )
                            }},
                            { 
                                ALT: () =>{ 
                                $.SUBRULE($.Call )
                            }}
                    ])
                });
                $.RULE("FlowControl", () => {
                        
                    $.OR([
                        { 
                            ALT: () =>{ 
                            $.CONSUME(this.Break)
                        }},
                        { 
                            ALT: () =>{ 
                            $.CONSUME(this.Continue )
                        }}
                ])
            });
            $.RULE("Expression", () => {
                        
                $.OR([
                    { 
                        ALT: () =>{ 
                        $.SUBRULE($.Unary)
                    }},
                    { 
                        ALT: () =>{ 
                            $.SUBRULE($.Binary)
                    }},
                    { 
                        ALT: () =>{ 
                            $.SUBRULE($.Ternary)
                    }},
                    { 
                        ALT: () =>{ 
                            $.SUBRULE($.Const)
                    }},
                    { 
                        ALT: () =>{ 
                        $.CONSUME(this.OpenBracket )
                        $.SUBRULE($.Expression)
                        $.CONSUME(this.CloseBracket )
                    }}
            ])
        });
        $.RULE("Unary", () => {
                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Expression)
                        $.SUBRULE($.Unary_Operator)
                }},
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Unary_Operator)
                }}
        ])
    });
            $.RULE("Unary_Operator", () => {
                                
                $.OR([
                    { 
                        ALT: () =>{ 
                            $.CONSUME(this.Minus)
                            $.CONSUME(this.Minus)
                    }},
                    { 
                        ALT: () =>{ 
                            $.CONSUME(this.Plus)
                            $.CONSUME(this.Plus)
                    }}
            ])
        });

        $.RULE("Binary", () => {
                        
            $.SUBRULE($.Expression);
            $.SUBRULE($.Binary_Operator);
            $.SUBRULE($.Expression);
    });

    $.RULE("Binary_Operator ", () => {
                                
        $.OR([
            { 
                ALT: () =>{ 
                    $.CONSUME(this.Minus)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(this.Plus)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(this.Multiply)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(this.Divide)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(this.Mod)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(this.Or)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(this.And)
            }}
    ])
});


        $.RULE("Ternary", () => {
                                
            $.SUBRULE($.Condition)
            $.CONSUME(this.tEqual)
            $.SUBRULE($.Ternary_Instr )
            $.CONSUME(this.Colon)
            $.SUBRULE($.Ternary_Instr)
        });


        $.RULE("Ternary_Instr", () => {
                                
            $.OR([
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Variable)
                }},
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Const)
                }}
        ])
    });

    $.RULE("Condition", () => {
                                
        $.OR([
            { 
                ALT: () =>{ 
                    $.CONSUME(this.OpenBracket)
                    $.SUBRULE($.Condition)
                    $.CONSUME(this.CloseBracket)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(this.Not)
                    $.CONSUME(this.OpenBracket)
                    $.SUBRULE($.Condition)
                    $.CONSUME(this.CloseBracket)
            }},
            { 
                ALT: () =>{ 
                    $.SUBRULE($.bool_expr)
                    $.SUBRULE($.Logical_Operator )
                    $.SUBRULE($.bool_expr)
            }},
            { 
                ALT: () =>{ 
                    $.SUBRULE($.Expression)
                    $.SUBRULE($.Relational_Operator  )
                    $.SUBRULE($.Expression)
            }}
    ])
});

        $.RULE("bool_expr", () => {
                                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.True)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.False)
                }},
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Variable)
                }},
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Condition)
                }}
        ])
        });

        $.RULE("Logical_Operator", () => {
                                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.And)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.Or)
                }}
        ])
        });

        $.RULE("Relational_Operator", () => {
                                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.LessThan)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.GreaterThan)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.tLessThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.tGreaterThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.tEqual)
                }}
        ])
        });


        $.RULE("Declaration", () => {
                                
            
            $.CONSUME(this.tVariable)
            $.CONSUME(this.tUserDefinedIdentifier)
            $.SUBRULE($.Field)
        });

        $.RULE("Field", () => {
                                
            $.OPTION(() => {
                $.CONSUME(this.OpenSquareBracket)
                $.SUBRULE($.Index)
                $.CONSUME(this.ClosedSquareBracket)
            })
        });




        $.RULE("Index", () => {
                                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Const)
                }},
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Variable)
                }},
        ])
        });


        $.RULE("Const", () => {
                                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.tFloatLiteral)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.StringLiteral)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.True)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(this.False)
                }}
        ])
        });

        
        $.RULE("Variable", () => {
                                
            $.OPTION(() => {
                $.CONSUME(this.tUserDefinedIdentifier)
                $.SUBRULE($.Field)
            })
        });


        this.performSelfAnalysis();
      }

    

    

}