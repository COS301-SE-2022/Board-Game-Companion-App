import { Injectable } from '@nestjs/common';
import * as chevrotain from 'chevrotain';
import { CstNode, CstParser, ParserMethod } from 'chevrotain';
import { lexerResult } from '../../models/general/lexerResult';

@Injectable()
export class CompilerService {
    p = new parser();
    compile(input:string):string
    {
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
        this.p.input = this.scanHelper(input).tokens;
        const cstOutput = this.p.Program();
        
        return "parse " + cstOutput;
    }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
class parser extends CstParser
{
    






    Program: ParserMethod<unknown[], CstNode>;
    GameState: ParserMethod<unknown[], CstNode>;
    Definition: ParserMethod<unknown[], CstNode>;
    Cards: ParserMethod<unknown[], CstNode>;
    Players: ParserMethod<unknown[], CstNode>;
    End_Game: ParserMethod<unknown[], CstNode>;
    nParameters: ParserMethod<unknown[], CstNode>;
    CardEffect : ParserMethod<unknown[], CstNode>;
    CardCondition: ParserMethod<unknown[], CstNode>;
    TypeList: ParserMethod<unknown[], CstNode>;
    Type: ParserMethod<unknown[], CstNode>;
    statements: ParserMethod<unknown[], CstNode>;
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
    nVariable : ParserMethod<unknown[], CstNode>;
    Expression: ParserMethod<unknown[], CstNode>;
    MethodCall:ParserMethod<unknown[], CstNode>;
    Arguments:ParserMethod<unknown[], CstNode>;
    nCondition:ParserMethod<unknown[], CstNode>;
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
    BinaryOperator:ParserMethod<unknown[], CstNode>;
    Ternary_Instr :ParserMethod<unknown[], CstNode>;
    Logical_Operator :ParserMethod<unknown[], CstNode>;
    Relational_Operator :ParserMethod<unknown[], CstNode>;
    Field:ParserMethod<unknown[], CstNode>;
    Index:ParserMethod<unknown[], CstNode>;
    otherArgs:ParserMethod<unknown[], CstNode>;
    Value:ParserMethod<unknown[], CstNode>;
    constructor() {

//user defined identifier
        const tUserDefinedIdentifier = chevrotain.createToken({name:"UserDefinedIdentifier",pattern:/[a-zA-Z_]+[a-zA-Z0-9]*/});
// class and function declaration
        const Class = chevrotain.createToken({name:"Class",pattern:/card/,longer_alt:tUserDefinedIdentifier});
        const tAction =(chevrotain.createToken({name:"Action",pattern:/action/,longer_alt:tUserDefinedIdentifier}));
        const tParameters =(chevrotain.createToken({name:"Parameters",pattern:/parameters/,longer_alt:tUserDefinedIdentifier}));
        const tCondition=(chevrotain.createToken({name:"Condition",pattern:/condition/,longer_alt:tUserDefinedIdentifier}));
        const tEffect=(chevrotain.createToken({name:"Effect",pattern:/effect/,longer_alt:tUserDefinedIdentifier}));
        const tState=(chevrotain.createToken({name:"State",pattern:/state/,longer_alt:tUserDefinedIdentifier}));
        const Turn=(chevrotain.createToken({name:"Turn",pattern:/turn/,longer_alt:tUserDefinedIdentifier}));
        const tPlayer=(chevrotain.createToken({name:"Player",pattern:/player/,longer_alt:tUserDefinedIdentifier}));
        const tEndgame=(chevrotain.createToken({name:"Endgame",pattern:/endgame/,longer_alt:tUserDefinedIdentifier}));
        const tReturn=(chevrotain.createToken({name:"Return",pattern:/return/,longer_alt:tUserDefinedIdentifier}));

//punctuation
        const Comma=(chevrotain.createToken({name:"Comma",pattern:/,/}));
        const OpenBracket=(chevrotain.createToken({name:"OpenBracket",pattern:/\(/ }));
        const CloseBracket=(chevrotain.createToken({name:"CloseBracket",pattern:/\)/}));
        const OpenBrace=(chevrotain.createToken({name:"OpenBrace",pattern:/{/}));
        const CloseBrace=(chevrotain.createToken({name:"CloseBrace",pattern:/}/}));
        const Colon=(chevrotain.createToken({name:"Colon",pattern:/:/}));
        const OpenSquareBracket=(chevrotain.createToken({name:"OpenSquareBracket",pattern:/\[/}));
        const ClosedSquareBracket=(chevrotain.createToken({name:"ClosedSquareBracket",pattern:/\]/}));
        const QuestionMark=(chevrotain.createToken({name:"QuestionMark",pattern:/\?/}));
        const SemiColon=(chevrotain.createToken({name:"SemiColon",pattern:/;/}));
        const Dot = chevrotain.createToken({name:"Dot",pattern:/./})
//relational operators
        const tGreaterThanOrEqual = chevrotain.createToken({name:"GreaterThanOrEqual",pattern:/>=/});
        const tLessThanOrEqual = chevrotain.createToken({name:"LessThanOrEqual",pattern:/<=/});
        const tEqual = chevrotain.createToken({name:"Equal",pattern:/==/});
        const GreaterThan=(chevrotain.createToken({name:"GreaterThan",pattern:/>/,longer_alt:tGreaterThanOrEqual}));
        const LessThan=(chevrotain.createToken({name:"LessThan",pattern:/</,longer_alt:tLessThanOrEqual}));

//Assignment operators
        const Assign=(chevrotain.createToken({name:"Assign",pattern:/=/,longer_alt:tEqual}));

//increment
        const tIncrement = chevrotain.createToken({name:"Increment",pattern:/\+\+/});

//decrement
        const tDecrement = chevrotain.createToken({name:"Decrement",pattern:/--/ });

//arithmetic operators
        const Plus=(chevrotain.createToken({name:"Plus",pattern:/\+/,longer_alt:tIncrement}));
        const Minus=(chevrotain.createToken({name:"Minus",pattern:/-/,longer_alt:tDecrement}));
        const Multiply=(chevrotain.createToken({name:"Multiply",pattern:/\*/}));
        const Divide=(chevrotain.createToken({name:"Divide",pattern:/\\/}));
        const Mod=(chevrotain.createToken({name:"Mod",pattern:/mod/,longer_alt:tUserDefinedIdentifier}));

//logical operators
        const And=(chevrotain.createToken({name:"And",pattern:/and/,longer_alt:tUserDefinedIdentifier}));
        const Or=(chevrotain.createToken({name:"Or",pattern:/or/,longer_alt:tUserDefinedIdentifier}));
        const Not=(chevrotain.createToken({name:"Not",pattern:/not/,longer_alt:tUserDefinedIdentifier}));

//literals
        const tFloatLiteral = chevrotain.createToken({name:"FloatLiteral",pattern:/-?([1-9]+[0-9]*\.?[0-9]*|0?\.[0-9]+)/});


        const IntegerLiteral=(chevrotain.createToken({name:"IntegerLiteral",pattern:/0|-?[1-9][1-9]*/,longer_alt:tFloatLiteral}));
        const StringLiteral=(chevrotain.createToken({name:"StringLiteral",pattern:/("[A-Za-z0-9]*") | ('[A-Za-z0-9]*')/ }));
        const False=(chevrotain.createToken({name:"False",pattern:/false/,longer_alt:tUserDefinedIdentifier}));
        const True=(chevrotain.createToken({name:"True",pattern:/true/,longer_alt:tUserDefinedIdentifier}));


//input output
        const Input=(chevrotain.createToken({name:"Input",pattern:/input/,longer_alt:tUserDefinedIdentifier}));
        const Print=(chevrotain.createToken({name:"Print",pattern:/print/,longer_alt:tUserDefinedIdentifier}));
        const Read=(chevrotain.createToken({name:"Read",pattern:/read/,longer_alt:tUserDefinedIdentifier}));
        const ConsoleInput=(chevrotain.createToken({name:"ConsoleInput",pattern:/console.input/,longer_alt:tUserDefinedIdentifier}));
        const ConsoleOutput=(chevrotain.createToken({name:"ConsoleOutput",pattern:/console.print/,longer_alt:tUserDefinedIdentifier}));

//loops
        const While=(chevrotain.createToken({name:"While",pattern:/while/,longer_alt:tUserDefinedIdentifier}));
        const For=(chevrotain.createToken({name:"For",pattern:/for/,longer_alt:tUserDefinedIdentifier}));
        const Do=(chevrotain.createToken({name:"do",pattern:/do/,longer_alt:tUserDefinedIdentifier}));

//branch
        const If=(chevrotain.createToken({name:"If",pattern:/if/,longer_alt:tUserDefinedIdentifier}));
        const Else=(chevrotain.createToken({name:"Else",pattern:/else/,longer_alt:tUserDefinedIdentifier}));

//flow control
        const Break=(chevrotain.createToken({name:"Break",pattern:/break/,longer_alt:tUserDefinedIdentifier}));
        const Continue=(chevrotain.createToken({name:"Continue",pattern:/continue/,longer_alt:tUserDefinedIdentifier}));

//presets
        const Minmax=(chevrotain.createToken({name:"Minmax",pattern:/minmax/,longer_alt:tUserDefinedIdentifier}));
        const NeuralNetwork=(chevrotain.createToken({name:"NeuralNetwork",pattern:/neuralnetwork/}));

//variable
        const tVariable=(chevrotain.createToken({name:"Variable",pattern:/var/,longer_alt:tUserDefinedIdentifier}));

//whitespace
        const WhiteSpace=(chevrotain.createToken({name:"WhiteSpace",pattern:/\s+/,group: chevrotain.Lexer.SKIPPED}));

//comments
        const Coment=(chevrotain.createToken({name:"WhiteSpace",pattern:/\/\*[a-zA-Z0-9]*\*\//,group: chevrotain.Lexer.SKIPPED}));




    const AllTokens = [
        tUserDefinedIdentifier,
        Class,
        tAction,
        tParameters,
        tCondition,
        tEffect,
        tState,
        Turn,
        tPlayer,
        tEndgame,
        tReturn,
        Comma,
        OpenBracket,
        CloseBracket,
        OpenBrace,
        CloseBrace,
        Colon,
        OpenSquareBracket,
        ClosedSquareBracket,
        QuestionMark,
        SemiColon,
        Dot,
        tLessThanOrEqual,
        tGreaterThanOrEqual,
        tEqual,
        GreaterThan,
        LessThan,
        tIncrement,
        tDecrement,
        Plus,
        Minus,
        Multiply,
        Divide,
        Mod,
        And,
        Or,
        Not,
        tFloatLiteral,
        IntegerLiteral,
        StringLiteral,
        False,
        True,
        Input,
        Print,
        Read,
        ConsoleInput,
        ConsoleOutput,
        While,
        For,
        Do,
        If,
        Else,
        Break,
        Continue,
        Minmax,
        NeuralNetwork,
        tVariable,
        WhiteSpace,
        Coment,

    ];

        
        super(AllTokens) //should allTokens


        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const $ = this;

        
        
        $.RULE("Program", () => {
            $.SUBRULE($.GameState)
            $.SUBRULE($.Definition)
        });

        $.RULE("Definition", () => {
            $.OPTION(() => {
                $.OR([
                    { ALT: () =>{ $.SUBRULE($.Cards )
                            $.SUBRULE($.Definition)}},

                            
                    { ALT: () =>{ $.SUBRULE($.Players)
                            $.SUBRULE1($.Definition)}},

                    { ALT: () =>{ $.SUBRULE($.End_Game)
                            $.SUBRULE2($.Definition)}}
                        
                ])
            });
        });
        
        $.RULE("Cards", () => {
            $.CONSUME(Class)
            $.CONSUME(tUserDefinedIdentifier)
            $.CONSUME(OpenBrace)
            $.SUBRULE($.nParameters),
            $.SUBRULE($.CardEffect )
            $.SUBRULE($.CardCondition)
            $.CONSUME(CloseBrace)
        });
        $.RULE("nParameters", () => {
            $.CONSUME(tParameters )
            $.CONSUME(OpenBrace)
            $.SUBRULE($.TypeList)
            $.CONSUME(CloseBrace)
        });

        $.RULE("TypeList", () => {
                this.MANY(() => {
                $.OPTION(() => {
                    $.SUBRULE($.Type)
                    $.CONSUME(tUserDefinedIdentifier)
                });
            })
        });
        $.RULE("CardCondition", () => {
            $.CONSUME(tCondition )
            $.CONSUME(OpenBrace)
            $.SUBRULE($.statements)
            $.CONSUME(tReturn)
            $.OR([
                { ALT: () =>{ $.SUBRULE($.Const )}}, 
                { ALT: () =>{ $.SUBRULE($.nVariable)}}
            ])
            $.CONSUME(CloseBrace)
        });
        $.RULE("CardEffect", () => {
            $.CONSUME(tEffect )
            $.CONSUME(OpenBrace)
            $.SUBRULE($.statements)
            $.CONSUME(CloseBrace)
        });
        $.RULE("GameState", () => {
            $.CONSUME(tState )
            $.CONSUME(OpenBrace)
            $.SUBRULE($.Declarations )
            $.CONSUME(CloseBrace)
        });
        $.RULE("Players", () => {
            $.CONSUME(tPlayer)
            $.CONSUME(tUserDefinedIdentifier)
            $.CONSUME(OpenBrace)
            $.SUBRULE($.Actions )
            $.CONSUME( Turn)
            $.SUBRULE($.statements )
            $.CONSUME(CloseBrace)
        });

        $.RULE("Actions", () => {
            this.MANY(() => {
                $.OPTION(() => {
                    
                $.CONSUME(tAction)
                $.CONSUME(tUserDefinedIdentifier)
                $.CONSUME(OpenBracket)
                $.SUBRULE($.FormalParameters)
                $.CONSUME(CloseBracket)
                $.CONSUME(OpenBrace)  
                $.SUBRULE($.statements )
                $.CONSUME(CloseBrace)  
                $.SUBRULE($.nCondition )
                $.CONSUME1(tUserDefinedIdentifier)
                $.CONSUME1(OpenBracket)
                $.SUBRULE1($.FormalParameters)
                $.CONSUME1(CloseBracket)
                $.CONSUME1(OpenBrace)
                $.SUBRULE1($.statements)
                $.CONSUME(tReturn)
                $.OR([
                    { ALT: () =>{ $.SUBRULE($.Const )}}, 
                    { ALT: () =>{ $.SUBRULE($.nVariable)}}
                ])
                $.CONSUME1(CloseBrace)
                });
        })
        });
        $.RULE("FormalParameters", () => {
            $.OPTION(() => {
                $.CONSUME(tUserDefinedIdentifier)
                $.SUBRULE($.OtherFormalParameters);
            });
        });
        $.RULE("OtherFormalParameters", () => {
            $.OPTION(() => {
                $.CONSUME(tUserDefinedIdentifier)
                $.SUBRULE($.OtherFormalParameters);
            });
        });
        $.RULE("End_Game", () => {
            $.CONSUME(tEndgame)
            $.CONSUME(OpenBrace)
            $.SUBRULE($.statements)
            $.CONSUME(tReturn)

            $.OR([
                { ALT: () =>{ $.SUBRULE($.Const )}}, 
                { ALT: () =>{ $.SUBRULE($.nVariable)}}
            ])

            $.CONSUME(CloseBrace)
            $.SUBRULE($.Actions);
        });


        $.RULE("statements", () => {
            $.OPTION(() => {
                $.OR([
                    { ALT: () =>{ $.SUBRULE($.IO )
                            $.SUBRULE($.statements)}},

                            
                    { ALT: () =>{ $.SUBRULE($.Call)
                            $.SUBRULE1($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.Loop)
                            $.SUBRULE2($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.Branch)
                            $.SUBRULE3($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.Declaration )
                            $.SUBRULE4($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.Assignment )
                            $.SUBRULE5($.statements)}},

                    { ALT: () =>{ $.SUBRULE($.FlowControl )
                            $.SUBRULE6($.statements)}},

                    { ALT: () =>{ $.CONSUME(tReturn )
                            $.SUBRULE($.nVariable )}},
                ])
            });
        });
        $.RULE("IO", () => {
            
                $.OR([
                     
                        { ALT: () =>{ $.CONSUME(Input )
                            $.CONSUME(OpenBracket )
                            $.CONSUME(StringLiteral )
                            this.OPTION(() => {
                                $.CONSUME(Comma )
                            $.SUBRULE($.nVariable )}
                              );
                            $.CONSUME(CloseBracket )
                        }},

                        { ALT: () =>{ 
                            $.CONSUME(ConsoleInput )
                            $.CONSUME2(OpenBracket )
                        $.CONSUME2(StringLiteral )
                        this.OPTION1(() => {
                            $.CONSUME1(Comma )
                            $.SUBRULE1($.nVariable )}
                          );
                        $.CONSUME2(CloseBracket )
                    }},

                        

                        { ALT: () =>{ $.CONSUME(Print )
                            $.CONSUME3(OpenBracket )
                            $.SUBRULE($.Expression)
                        $.CONSUME3(CloseBracket )
                        }},

                        { ALT: () =>{ $.CONSUME(ConsoleOutput )
                            $.CONSUME5(OpenBracket )
                            $.SUBRULE1($.Expression)
                        $.CONSUME5(CloseBracket )
                        }},
                    ])
                    
                });

                $.RULE("Call", () => {
            
                    $.OR([
                    { 
                        ALT: () =>{ 
                        $.SUBRULE($.MethodCall)
                    }},
                    { 
                        ALT: () =>{ 
                        $.CONSUME(Minmax )
                        $.CONSUME(OpenBracket )
                        $.CONSUME(OpenBrace )
                        $.SUBRULE($.statements)
                        $.CONSUME(CloseBrace )
                        $.CONSUME(CloseBracket )
                    }},
                    { 
                        ALT: () =>{ 
                        $.CONSUME(NeuralNetwork )
                        $.CONSUME1(OpenBracket )
                        $.CONSUME(StringLiteral )
                        $.CONSUME1(CloseBracket )
                    }},
                    ])
                    
                });


                $.RULE("MethodCall", () => {
            
                    $.OR([

                        { 
                            ALT: () =>{ 
                            $.CONSUME(tEffect )
                            $.CONSUME(OpenBracket )
                            $.SUBRULE($.Arguments )
                            $.CONSUME(CloseBracket )
                        }},
                        { 
                            ALT: () =>{ 
                                $.CONSUME(tCondition )
                                $.CONSUME1(OpenBracket )
                                $.SUBRULE1($.Arguments )
                                $.CONSUME1(CloseBracket )
                        }},

                    ])
                    
                });
                $.RULE("Loop", () => {
            
                    $.OR([

                        { 
                            ALT: () =>{ 
                            $.CONSUME(While )
                            $.CONSUME(OpenBracket )
                            $.SUBRULE($.nCondition)
                            $.CONSUME(CloseBracket )
                            $.CONSUME(OpenBrace )
                            $.SUBRULE($.statements)
                            $.CONSUME(CloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                $.CONSUME(For )
                                $.CONSUME1(OpenBracket )
                                $.SUBRULE($.ForLoopInitialiser )
                                $.CONSUME(SemiColon )
                                $.SUBRULE($.ForLoopCondition )
                                $.CONSUME1(SemiColon )
                                $.SUBRULE($.ForLoopStep )
                                $.CONSUME1(CloseBracket )
                                $.CONSUME1(OpenBrace )
                                $.SUBRULE1($.statements)
                                $.CONSUME1(CloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                $.CONSUME(Do )
                                $.CONSUME2(OpenBrace )
                                $.SUBRULE2($.statements )
                                $.CONSUME2(CloseBrace )
                                $.CONSUME1(While )
                                $.CONSUME2(OpenBracket )
                                $.SUBRULE1($.nCondition )
                                $.CONSUME2(CloseBracket )
                        }},
                    ])
                    
                });

                $.RULE("ForLoopInitialiser", () => {
                    $.OPTION(() => {
                        $.SUBRULE($.nVariable)
                    })
                });


                $.RULE("ForLoopCondition", () => {
                    
                   $.SUBRULE($.nCondition)
                    
                });
                $.RULE("ForLoopStep", () => {
                    
                    $.SUBRULE($.Expression)
                     
                 });
                 $.RULE("Branch", () => {
                    $.CONSUME(If )
                    $.CONSUME(OpenBracket )
                    $.SUBRULE($.nCondition)
                    $.CONSUME(CloseBracket )
                    $.CONSUME(OpenBrace )
                    $.SUBRULE($.statements)
                    $.CONSUME(CloseBrace )
                    $.SUBRULE($.Alternative)


                 });
                 $.RULE("Alternative", () => {
                    $.OR([
                        { 
                            ALT: () =>{ 
                            $.SUBRULE($.Branch)
                        }},
                        { 
                            ALT: () =>{ 
                            $.CONSUME(OpenBrace )
                            $.SUBRULE($.statements)
                            $.CONSUME(CloseBrace )
                        }},
                    ])
                 });
                 $.RULE("Declarations", () => {
                    this.MANY(() => {
                    
                        
                        
                                $.CONSUME(tVariable)
                                $.SUBRULE($.nVariable )
                                $.OPTION(() => {
                                    $.SUBRULE($.Field )
                                })
                    
                            })


                 });

                 $.RULE("Declaration", () => {
                                
            
                    $.CONSUME(tVariable)
                    $.CONSUME(tUserDefinedIdentifier)
                    $.SUBRULE($.Field)
                });


                 $.RULE("Assignment", () => {
                    
                    $.SUBRULE($.LHS )
                    $.CONSUME(Assign)
                    $.SUBRULE($.RHS )
                 });

                 $.RULE("LHS", () => {
                    
                    $.SUBRULE($.nVariable )
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
                            $.CONSUME(Break)
                        }},
                        { 
                            ALT: () =>{ 
                            $.CONSUME(Continue )
                        }}
                ])
            });
            $.RULE("Expression", () => {
                        
                $.OR([
                    { 
                        ALT: () =>{ 
                        $.SUBRULE($.Unary_Operator)
                        $.SUBRULE($.Value)
                    }},
                    { 
                        ALT: () =>{ 
                            $.SUBRULE1($.Value)
                            $.OR1([
                            {
                                ALT: () =>{ 
                                    $.SUBRULE1($.Unary_Operator)
                                }
                            },
                            {
                                ALT: () =>{ 
                                    $.SUBRULE($.Binary)
                                }
                            },
                            { 
                                ALT: () =>{ 
                                    $.OPTION1(() => {
                                    $.SUBRULE($.Relational_Operator)
                                    $.SUBRULE2($.Value)
                                    })
                                    $.OPTION(() => {
                                        $.SUBRULE($.Ternary)
                                    })
                                    
                            }},
                        ])
                    }}
            ])
        });
        $.RULE("Unary", () => {
                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.nVariable)
                        $.SUBRULE($.Unary_Operator)
                }},
                { 
                    ALT: () =>{ 
                        $.SUBRULE1($.Unary_Operator)
                        $.SUBRULE1($.nVariable)
                }}
        ])
    });
            $.RULE("Unary_Operator", () => {
                                
                $.OR([
                    { 
                        ALT: () =>{ 
                            $.CONSUME(Minus)
                            $.CONSUME1(Minus)
                    }},
                    { 
                        ALT: () =>{ 
                            $.CONSUME(Plus)
                            $.CONSUME1(Plus)
                    }}
            ])
        });

        $.RULE("Binary", () => {
                        
            $.SUBRULE($.BinaryOperator)
            $.SUBRULE1($.Value)
    });
    $.RULE("Value", () => {
        $.OR([
            { 
                ALT: () =>{ 
                    $.SUBRULE(this.Const)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(tUserDefinedIdentifier)
                    $.OPTION(() => {
                        $.SUBRULE($.Field )
                    })
            }}
    ])
    });
    $.RULE("BinaryOperator", () => {
                                
        $.OR([
                { 
                    ALT: () =>{ 
                        $.CONSUME(Minus)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(Plus)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(Multiply)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(Divide)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(Mod)
                }}
            ])
});


        $.RULE("Ternary", () => {
                                
            
            $.CONSUME(QuestionMark)
            $.SUBRULE($.Ternary_Instr )
            $.CONSUME(Colon)
            $.SUBRULE1($.Ternary_Instr)
        });


        $.RULE("Ternary_Instr", () => {
                                
            $.OR([
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.nVariable)
                }},
                { 
                    ALT: () =>{ 
                        $.SUBRULE($.Const)
                }}
        ])
    });

    $.RULE("nCondition", () => {
                                
        $.OR([
            { 
                ALT: () =>{ 
                    $.CONSUME(OpenBracket)
                    $.SUBRULE($.nCondition)
                    $.CONSUME(CloseBracket)
            }},
            { 
                ALT: () =>{ 
                    $.CONSUME(Not)
                    $.CONSUME1(OpenBracket)
                    $.SUBRULE1($.nCondition)
                    $.CONSUME1(CloseBracket)
            }},
            { 
                ALT: () =>{ 
                    $.SUBRULE($.nVariable)
                    $.OR1([
                        { ALT: () =>{ 
                            $.SUBRULE($.Logical_Operator )
                            $.SUBRULE2($.nCondition)
                        }}, 
                        { ALT: () =>{ 
                            $.SUBRULE($.Relational_Operator  )
                            $.SUBRULE($.Expression)
                        }}
                    ])
                    
            }},
            { 
                ALT: () =>{ 
                    $.SUBRULE($.Const)
                    $.OR2([
                        { ALT: () =>{ 
                            $.SUBRULE1($.Logical_Operator )
                            $.SUBRULE3($.nCondition)
                        }}, 
                        { ALT: () =>{ 
                            $.SUBRULE1($.Relational_Operator)
                            $.SUBRULE1($.Expression)
                        }}
                    ])
                    
                    
            }}
    ])
});

        

        $.RULE("Logical_Operator", () => {
                                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.CONSUME(And)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(Or)
                }}
        ])
        });

        $.RULE("Relational_Operator", () => {
                                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.CONSUME(LessThan)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(GreaterThan)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(tLessThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(tGreaterThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(tEqual)
                }}
        ])
        });


        

        $.RULE("Field", () => {
                                
            $.OPTION(() => {
                $.CONSUME(OpenSquareBracket)
                $.SUBRULE($.Index)
                $.CONSUME(ClosedSquareBracket)
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
                        $.SUBRULE($.nVariable)
                }},
        ])
        });


        $.RULE("Const", () => {
                                        
            $.OR([
                { 
                    ALT: () =>{ 
                        $.CONSUME(tFloatLiteral)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(StringLiteral)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(True)
                }},
                { 
                    ALT: () =>{ 
                        $.CONSUME(False)
                }}
        ])
        });

        
        $.RULE("nVariable", () => {
                                
            
            $.CONSUME(tUserDefinedIdentifier)
            $.OPTION(() => {
                $.SUBRULE($.Field)
            })
        });

        $.RULE("Type", () => {
                                        
            
            $.CONSUME(tPlayer)
                
        
        });
        $.RULE("Arguments", () => {
                                        
            $.OPTION(() => {
                $.OR([
                    { 
                        ALT: () =>{ 
                            $.CONSUME(tUserDefinedIdentifier)
                            $.SUBRULE($.otherArgs)
                    }},
                    { 
                        ALT: () =>{ 
                            $.SUBRULE($.Const)
                            $.SUBRULE1($.otherArgs)
                    }}
                ])
            })
        });


        $.RULE("otherArgs", () => {
            this.MANY(() => {                            
                $.OPTION(() => {
                    $.OR([
                        { 
                            ALT: () =>{ 
                                $.CONSUME(tUserDefinedIdentifier)
                                $.SUBRULE($.otherArgs)
                        }},
                        { 
                            ALT: () =>{ 
                                $.SUBRULE($.Const)
                                $.SUBRULE1($.otherArgs)
                        }}
                    ])
                })
            })
        });
        this.performSelfAnalysis();
      }

    

    

}