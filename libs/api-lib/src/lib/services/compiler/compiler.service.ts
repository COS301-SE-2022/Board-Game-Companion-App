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
            //result.errors = tokens.errors;
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
         Dot = chevrotain.createToken({name:"Dot",pattern:/./})
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

        this.performSelfAnalysis();
    }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
         this = this;
        
        
        public Program = this.RULE("Program", () => {
            this.SUBRULE(this.GameState)
            this.SUBRULE(this.Definition)
        });

        private Definition = this.RULE("Definition", () => {
            this.OPTION(() => {
                this.OR([
                    { ALT: () =>{ this.SUBRULE(this.Cards )
                            this.SUBRULE(this.Definition)}},

                            
                    { ALT: () =>{ this.SUBRULE(this.Players)
                            this.SUBRULE1(this.Definition)}},

                    { ALT: () =>{ this.SUBRULE(this.End_Game)
                            this.SUBRULE2(this.Definition)}}
                        
                ])
            });
        });
        
        private Cards = this.RULE("Cards", () => {
            this.CONSUME(this.Class)
            this.CONSUME(this.tUserDefinedIdentifier)
            this.CONSUME(this.OpenBrace)
            this.SUBRULE(this.nParameters),
            this.SUBRULE(this.CardEffect )
            this.SUBRULE(this.CardCondition)
            this.CONSUME(this.CloseBrace)
        });
        private nParameters =this.RULE("nParameters", () => {
            this.CONSUME(this.tParameters )
            this.CONSUME(this.OpenBrace)
            this.SUBRULE(this.TypeList)
            this.CONSUME(this.CloseBrace)
        });

        private TypeList=this.RULE("TypeList", () => {
                this.MANY(() => {
                this.OPTION(() => {
                    this.SUBRULE(this.Type)
                    this.CONSUME(this.tUserDefinedIdentifier)
                });
            })
        });
        private CardCondition= this.RULE("CardCondition", () => {
            this.CONSUME(this.tCondition )
            this.CONSUME(this.OpenBrace)
            this.SUBRULE(this.statements)
            this.CONSUME(this.tReturn)
            this.OR([
                { ALT: () =>{ this.SUBRULE(this.Const )}}, 
                { ALT: () =>{ this.SUBRULE(this.nVariable)}}
            ])
            this.CONSUME(this.CloseBrace)
        });
        private CardEffect=this.RULE("CardEffect", () => {
            this.CONSUME(this.tEffect )
            this.CONSUME(this.OpenBrace)
            this.SUBRULE(this.statements)
            this.CONSUME(this.CloseBrace)
        });
        private GameState=this.RULE("GameState", () => {
            this.CONSUME(this.tState )
            this.CONSUME(this.OpenBrace)
            this.SUBRULE(this.Declarations )
            this.CONSUME(this.CloseBrace)
        });
        private Players=this.RULE("Players", () => {
            this.CONSUME(this.tPlayer)
            this.CONSUME(this.tUserDefinedIdentifier)
            this.CONSUME(this.OpenBrace)
            this.SUBRULE(this.Actions )
            this.CONSUME( this.Turn)
            this.SUBRULE(this.statements )
            this.CONSUME(this.CloseBrace)
        });

        private Actions=this.RULE("Actions", () => {
            this.MANY(() => {
                this.OPTION(() => {
                    
                this.CONSUME(this.tAction)
                this.CONSUME(this.tUserDefinedIdentifier)
                this.CONSUME(this.OpenBracket)
                this.SUBRULE(this.FormalParameters)
                this.CONSUME(this.CloseBracket)
                this.CONSUME(this.OpenBrace)  
                this.SUBRULE(this.statements )
                this.CONSUME(this.CloseBrace)  
                this.SUBRULE(this.nCondition )
                this.CONSUME1(this.tUserDefinedIdentifier)
                this.CONSUME1(this.OpenBracket)
                this.SUBRULE1(this.FormalParameters)
                this.CONSUME1(this.CloseBracket)
                this.CONSUME1(this.OpenBrace)
                this.SUBRULE1(this.statements)
                this.CONSUME(this.tReturn)
                this.OR([
                    { ALT: () =>{ this.SUBRULE(this.Const )}}, 
                    { ALT: () =>{ this.SUBRULE(this.nVariable)}}
                ])
                this.CONSUME1(this.CloseBrace)
                });
        })
        });
        private FormalParameters=this.RULE("FormalParameters", () => {
            this.OPTION(() => {
                this.CONSUME(this.tUserDefinedIdentifier)
                this.SUBRULE(this.OtherFormalParameters);
            });
        });
        private OtherFormalParameters=this.RULE("OtherFormalParameters", () => {
            this.OPTION(() => {
                this.CONSUME(this.tUserDefinedIdentifier)
                this.SUBRULE(this.OtherFormalParameters);
            });
        });
        private End_Game=this.RULE("End_Game", () => {
            this.CONSUME(this.tEndgame)
            this.CONSUME(this.OpenBrace)
            this.SUBRULE(this.statements)
            this.CONSUME(this.tReturn)

            this.OR([
                { ALT: () =>{ this.SUBRULE(this.Const )}}, 
                { ALT: () =>{ this.SUBRULE(this.nVariable)}}
            ])

            this.CONSUME(this.CloseBrace)
            this.SUBRULE(this.Actions);
        });


        private statements=this.RULE("statements", () => {
            this.OPTION(() => {
                this.OR([
                    { ALT: () =>{ this.SUBRULE(this.IO )
                            this.SUBRULE(this.statements)}},

                            
                    { ALT: () =>{ this.SUBRULE(this.Call)
                            this.SUBRULE1(this.statements)}},

                    { ALT: () =>{ this.SUBRULE(this.Loop)
                            this.SUBRULE2(this.statements)}},

                    { ALT: () =>{ this.SUBRULE(this.Branch)
                            this.SUBRULE3(this.statements)}},

                    { ALT: () =>{ this.SUBRULE(this.Declaration )
                            this.SUBRULE4(this.statements)}},

                    { ALT: () =>{ this.SUBRULE(this.Assignment )
                            this.SUBRULE5(this.statements)}},

                    { ALT: () =>{ this.SUBRULE(this.FlowControl )
                            this.SUBRULE6(this.statements)}},

                    { ALT: () =>{ this.CONSUME(this.tReturn )
                            this.SUBRULE(this.nVariable )}},
                ])
            });
        });
        private IO=this.RULE("IO", () => {
            
                this.OR([
                     
                        { ALT: () =>{ this.CONSUME(this.Input )
                            this.CONSUME(this.OpenBracket )
                            this.CONSUME(this.StringLiteral )
                            this.OPTION(() => {
                                this.CONSUME(this.Comma )
                            this.SUBRULE(this.nVariable )}
                              );
                            this.CONSUME(this.CloseBracket )
                        }},

                        { ALT: () =>{ 
                            this.CONSUME(this.ConsoleInput )
                            this.CONSUME2(this.OpenBracket )
                        this.CONSUME2(this.StringLiteral )
                        this.OPTION1(() => {
                            this.CONSUME1(this.Comma )
                            this.SUBRULE1(this.nVariable )}
                          );
                        this.CONSUME2(this.CloseBracket )
                    }},

                        

                        { ALT: () =>{ this.CONSUME(this.Print )
                            this.CONSUME3(this.OpenBracket )
                            this.SUBRULE(this.Expression)
                        this.CONSUME3(this.CloseBracket )
                        }},

                        { ALT: () =>{ this.CONSUME(this.ConsoleOutput )
                            this.CONSUME5(this.OpenBracket )
                            this.SUBRULE1(this.Expression)
                        this.CONSUME5(this.CloseBracket )
                        }},
                    ])
                    
                });

                private Call=this.RULE("Call", () => {
            
                    this.OR([
                    { 
                        ALT: () =>{ 
                        this.SUBRULE(this.MethodCall)
                    }},
                    { 
                        ALT: () =>{ 
                        this.CONSUME(this.Minmax )
                        this.CONSUME(this.OpenBracket )
                        this.CONSUME(this.OpenBrace )
                        this.SUBRULE(this.statements)
                        this.CONSUME(this.CloseBrace )
                        this.CONSUME(this.CloseBracket )
                    }},
                    { 
                        ALT: () =>{ 
                        this.CONSUME(this.NeuralNetwork )
                        this.CONSUME1(this.OpenBracket )
                        this.CONSUME(this.StringLiteral )
                        this.CONSUME1(this.CloseBracket )
                    }},
                    ])
                    
                });


                private MethodCall=this.RULE("MethodCall", () => {
            
                    this.OR([

                        { 
                            ALT: () =>{ 
                            this.CONSUME(this.tEffect )
                            this.CONSUME(this.OpenBracket )
                            this.SUBRULE(this.Arguments )
                            this.CONSUME(this.CloseBracket )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(this.tCondition )
                                this.CONSUME1(this.OpenBracket )
                                this.SUBRULE1(this.Arguments )
                                this.CONSUME1(this.CloseBracket )
                        }},

                    ])
                    
                });
                private Loop=this.RULE("Loop", () => {
            
                    this.OR([

                        { 
                            ALT: () =>{ 
                            this.CONSUME(this.While )
                            this.CONSUME(this.OpenBracket )
                            this.SUBRULE(this.nCondition)
                            this.CONSUME(this.CloseBracket )
                            this.CONSUME(this.OpenBrace )
                            this.SUBRULE(this.statements)
                            this.CONSUME(this.CloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(this.For )
                                this.CONSUME1(this.OpenBracket )
                                this.SUBRULE(this.ForLoopInitialiser )
                                this.CONSUME(this.SemiColon )
                                this.SUBRULE(this.ForLoopCondition )
                                this.CONSUME1(this.SemiColon )
                                this.SUBRULE(this.ForLoopStep )
                                this.CONSUME1(this.CloseBracket )
                                this.CONSUME1(this.OpenBrace )
                                this.SUBRULE1(this.statements)
                                this.CONSUME1(this.CloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(this.Do )
                                this.CONSUME2(this.OpenBrace )
                                this.SUBRULE2(this.statements )
                                this.CONSUME2(this.CloseBrace )
                                this.CONSUME1(this.While )
                                this.CONSUME2(this.OpenBracket )
                                this.SUBRULE1(this.nCondition )
                                this.CONSUME2(this.CloseBracket )
                        }},
                    ])
                    
                });

                private ForLoopInitialiser=this.RULE("ForLoopInitialiser", () => {
                    this.OPTION(() => {
                        this.SUBRULE(this.nVariable)
                    })
                });


                private ForLoopCondition=this.RULE("ForLoopCondition", () => {
                    
                   this.SUBRULE(this.nCondition)
                    
                });
                private ForLoopStep=this.RULE("ForLoopStep", () => {
                    
                    this.SUBRULE(this.Expression)
                     
                 });
                 private Branch=this.RULE("Branch", () => {
                    this.CONSUME(this.If )
                    this.CONSUME(this.OpenBracket )
                    this.SUBRULE(this.nCondition)
                    this.CONSUME(this.CloseBracket )
                    this.CONSUME(this.OpenBrace )
                    this.SUBRULE(this.statements)
                    this.CONSUME(this.CloseBrace )
                    this.SUBRULE(this.Alternative)


                 });
                 private Alternative=this.RULE("Alternative", () => {
                    this.OR([
                        { 
                            ALT: () =>{ 
                            this.SUBRULE(this.Branch)
                        }},
                        { 
                            ALT: () =>{ 
                            this.CONSUME(this.OpenBrace )
                            this.SUBRULE(this.statements)
                            this.CONSUME(this.CloseBrace )
                        }},
                    ])
                 });
                 private Declarations=this.RULE("Declarations", () => {
                    this.MANY(() => {
                    
                        
                        
                                this.CONSUME(this.tVariable)
                                this.SUBRULE(this.nVariable )
                                this.OPTION(() => {
                                    this.SUBRULE(this.Field )
                                })
                    
                            })


                 });

                 private Declaration=this.RULE("Declaration", () => {
                                
            
                    this.CONSUME(this.tVariable)
                    this.CONSUME(this.tUserDefinedIdentifier)
                    this.SUBRULE(this.Field)
                });


                 private Assignment=this.RULE("Assignment", () => {
                    
                    this.SUBRULE(this.LHS )
                    this.CONSUME(this.Assign)
                    this.SUBRULE(this.RHS )
                 });

                 private LHS=this.RULE("LHS", () => {
                    
                    this.SUBRULE(this.nVariable )
                 });

                 private RHS=this.RULE("RHS", () => {
                    
                        this.OR([
                            { 
                                ALT: () =>{ 
                                this.SUBRULE(this.Expression )
                            }},
                            { 
                                ALT: () =>{ 
                                this.SUBRULE(this.Call )
                            }}
                    ])
                });
                private FlowControl=this.RULE("FlowControl", () => {
                        
                    this.OR([
                        { 
                            ALT: () =>{ 
                            this.CONSUME(this.Break)
                        }},
                        { 
                            ALT: () =>{ 
                            this.CONSUME(this.Continue )
                        }}
                ])
            });
            private Expression=this.RULE("Expression", () => {
                        
                this.OR([
                    { 
                        ALT: () =>{ 
                        this.SUBRULE(this.Unary_Operator)
                        this.SUBRULE(this.Value)
                    }},
                    { 
                        ALT: () =>{ 
                            this.SUBRULE1(this.Value)
                            this.OR1([
                            {
                                ALT: () =>{ 
                                    this.SUBRULE1(this.Unary_Operator)
                                }
                            },
                            {
                                ALT: () =>{ 
                                    this.SUBRULE(this.Binary)
                                }
                            },
                            { 
                                ALT: () =>{ 
                                    this.OPTION1(() => {
                                    this.SUBRULE(this.Relational_Operator)
                                    this.SUBRULE2(this.Value)
                                    })
                                    this.OPTION(() => {
                                        this.SUBRULE(this.Ternary)
                                    })
                                    
                            }},
                        ])
                    }}
            ])
        });
        private Unary=this.RULE("Unary", () => {
                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.SUBRULE(this.nVariable)
                        this.SUBRULE(this.Unary_Operator)
                }},
                { 
                    ALT: () =>{ 
                        this.SUBRULE1(this.Unary_Operator)
                        this.SUBRULE1(this.nVariable)
                }}
        ])
    });
            private Unary_Operator=this.RULE("Unary_Operator", () => {
                                
                this.OR([
                    { 
                        ALT: () =>{ 
                            this.CONSUME(this.Minus)
                            this.CONSUME1(this.Minus)
                    }},
                    { 
                        ALT: () =>{ 
                            this.CONSUME(this.Plus)
                            this.CONSUME1(this.Plus)
                    }}
            ])
        });

        private Binary=this.RULE("Binary", () => {
                        
            this.SUBRULE(this.BinaryOperator)
            this.SUBRULE1(this.Value)
    });
    private  Value = this.RULE("Value", () => {
        this.OR([
            { 
                ALT: () =>{ 
                    this.SUBRULE(this.Const)
            }},
            { 
                ALT: () =>{ 
                    this.CONSUME(this.tUserDefinedIdentifier)
                    this.OPTION(() => {
                        this.SUBRULE(this.Field )
                    })
            }}
    ])
    });
    private BinaryOperator=this.RULE("BinaryOperator", () => {
                                
        this.OR([
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.Minus)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.Plus)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.Multiply)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.Divide)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.Mod)
                }}
            ])
});


        private Ternary=this.RULE("Ternary", () => {
                                
            
            this.CONSUME(this.QuestionMark)
            this.SUBRULE(this.Ternary_Instr )
            this.CONSUME(this.Colon)
            this.SUBRULE1(this.Ternary_Instr)
        });


        private Ternary_Instr=this.RULE("Ternary_Instr", () => {
                                
            this.OR([
                { 
                    ALT: () =>{ 
                        this.SUBRULE(this.nVariable)
                }},
                { 
                    ALT: () =>{ 
                        this.SUBRULE(this.Const)
                }}
        ])
    });

    private nCondition=this.RULE("nCondition", () => {
                                
        this.OR([
            { 
                ALT: () =>{ 
                    this.CONSUME(this.OpenBracket)
                    this.SUBRULE(this.nCondition)
                    this.CONSUME(this.CloseBracket)
            }},
            { 
                ALT: () =>{ 
                    this.CONSUME(this.Not)
                    this.CONSUME1(this.OpenBracket)
                    this.SUBRULE1(this.nCondition)
                    this.CONSUME1(this.CloseBracket)
            }},
            { 
                ALT: () =>{ 
                    this.SUBRULE(this.nVariable)
                    this.OR1([
                        { ALT: () =>{ 
                            this.SUBRULE(this.Logical_Operator )
                            this.SUBRULE2(this.nCondition)
                        }}, 
                        { ALT: () =>{ 
                            this.SUBRULE(this.Relational_Operator  )
                            this.SUBRULE(this.Expression)
                        }}
                    ])
                    
            }},
            { 
                ALT: () =>{ 
                    this.SUBRULE(this.Const)
                    this.OR2([
                        { ALT: () =>{ 
                            this.SUBRULE1(this.Logical_Operator )
                            this.SUBRULE3(this.nCondition)
                        }}, 
                        { ALT: () =>{ 
                            this.SUBRULE1(this.Relational_Operator)
                            this.SUBRULE1(this.Expression)
                        }}
                    ])
                    
                    
            }}
    ])
});

        

        private Logical_Operator=this.RULE("Logical_Operator", () => {
                                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.And)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.Or)
                }}
        ])
        });

        private Relational_Operator=this.RULE("Relational_Operator", () => {
                                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.LessThan)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.GreaterThan)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.tLessThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.tGreaterThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.tEqual)
                }}
        ])
        });


        

        private Field=this.RULE("Field", () => {
                                
            this.OPTION(() => {
                this.CONSUME(this.OpenSquareBracket)
                this.SUBRULE(this.Index)
                this.CONSUME(this.ClosedSquareBracket)
            })
        });




        private Index=this.RULE("Index", () => {
                                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.SUBRULE(this.Const)
                }},
                { 
                    ALT: () =>{ 
                        this.SUBRULE(this.nVariable)
                }},
        ])
        });


        private Const=this.RULE("", () => {
                                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.tFloatLiteral)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.StringLiteral)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.True)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(this.False)
                }}
        ])
        });

        
        private nVariable=this.RULE("nVariable", () => {
                                
            
            this.CONSUME(this.tUserDefinedIdentifier)
            this.OPTION(() => {
                this.SUBRULE(this.Field)
            })
        });

        private Type=this.RULE("Type", () => {
                                        
            
            this.CONSUME(this.tPlayer)
                
        
        });
        private Arguments=this.RULE("Arguments", () => {
                                        
            this.OPTION(() => {
                this.OR([
                    { 
                        ALT: () =>{ 
                            this.CONSUME(this.tUserDefinedIdentifier)
                            this.SUBRULE(this.otherArgs)
                    }},
                    { 
                        ALT: () =>{ 
                            this.SUBRULE(this.Const)
                            this.SUBRULE1(this.otherArgs)
                    }}
                ])
            })
        });


        private otherArgs=this.RULE("otherArgs", () => {
            this.MANY(() => {                            
                this.OPTION(() => {
                    this.OR([
                        { 
                            ALT: () =>{ 
                                this.CONSUME(this.tUserDefinedIdentifier)
                                this.SUBRULE(this.otherArgs)
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.Const)
                                this.SUBRULE1(this.otherArgs)
                        }}
                    ])
                })
            })
        });
        

    

    

}