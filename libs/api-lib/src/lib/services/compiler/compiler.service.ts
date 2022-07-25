import { Injectable } from '@nestjs/common';
import * as chevrotain from 'chevrotain';
import {  CstNode, CstParser, IToken } from 'chevrotain';
import * as fs from 'fs'
import { lexerResult } from '../../models/general/lexerResult';


let scriptTemplate = "//State  //players   class script{\nplayers = [ //add players \n]}";


scriptTemplate = fs.readFileSync("templates/script.js","utf8");


  
    
  //geiing the script template into the var

let jsScript = scriptTemplate;

//user defined identifier
const tUserDefinedIdentifier = chevrotain.createToken({name:"UserDefinedIdentifier",pattern:/[a-zA-Z_]+[a-zA-Z0-9]*/});
// class and function declaration
        const tAction =(chevrotain.createToken({name:"Action",pattern:/action/,longer_alt:tUserDefinedIdentifier}));
        const tParameters =(chevrotain.createToken({name:"Parameters",pattern:/parameters/,longer_alt:tUserDefinedIdentifier}));
        const tCondition=(chevrotain.createToken({name:"Condition",pattern:/condition/,longer_alt:tUserDefinedIdentifier}));
        const tEffect=(chevrotain.createToken({name:"Effect",pattern:/effect/,longer_alt:tUserDefinedIdentifier}));
        const tState=(chevrotain.createToken({name:"State",pattern:/state/,longer_alt:tUserDefinedIdentifier}));
        const Turn=(chevrotain.createToken({name:"Turn",pattern:/turn/,longer_alt:tUserDefinedIdentifier}));
        const tPlayer=(chevrotain.createToken({name:"Player",pattern:/player/,longer_alt:tUserDefinedIdentifier}));
        const tCards=(chevrotain.createToken({name:"Card",pattern:/card/,longer_alt:tUserDefinedIdentifier}));
        
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
        const Dot = chevrotain.createToken({name:"Dot",pattern:/\./})
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
    
    tAction,
    tParameters,
    tCondition,
    tEffect,
    tState,
    Turn,
    tPlayer,
    tCards,
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
    Assign,
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
    tUserDefinedIdentifier,
];


@Injectable()
export class CompilerService {

    

    DSLparser = new parser();
    compile(input:string):string
    {
        return "compile " + input;
    }
     

    scanHelper(input:string):chevrotain.ILexingResult{
         const tokens:chevrotain.TokenType[] = AllTokens; 
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
        this.DSLparser.input = this.scanHelper(input).tokens;
         const cstOutput = this.DSLparser.Program();
        if(this.DSLparser.errors.length!=0)
        {
            throw Error(this.DSLparser.errors.toString()+"!!"+this.scanHelper(input).tokens[0].tokenType.PATTERN);
        }

        //otherwise successful parse
        

        return "parse " + cstOutput;

        
    }


    transpile(input:string)
    {
        this.DSLparser.input = this.scanHelper(input).tokens;
        const cstOutput = this.DSLparser.Program();

        //read in template file
        jsScript = scriptTemplate;
        //begin transpilation
        visit(cstOutput)

        return jsScript;
    }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
class parser extends CstParser
{
    


    
    constructor() {
        

        
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
            this.CONSUME(tCards)
            this.CONSUME(tUserDefinedIdentifier)
            this.CONSUME(OpenBrace)
            this.SUBRULE(this.nParameters),
            this.SUBRULE(this.CardEffect )
            this.SUBRULE(this.CardCondition)
            this.CONSUME(CloseBrace)
        });
        private nParameters =this.RULE("nParameters", () => {
            this.CONSUME(tParameters )
            this.CONSUME(OpenBrace)
            this.SUBRULE(this.TypeList)
            this.CONSUME(CloseBrace)
        });

        private TypeList=this.RULE("TypeList", () => {
                this.MANY(() => {
                this.OPTION(() => {
                    this.SUBRULE(this.Type)
                    this.CONSUME(tUserDefinedIdentifier)
                });
            })
        });
        private CardCondition= this.RULE("CardCondition", () => {
            this.CONSUME(tCondition )
            this.CONSUME(OpenBrace)
            this.SUBRULE(this.statements)
            this.CONSUME(tReturn)
            this.OR([
                { ALT: () =>{ this.SUBRULE(this.Const )}}, 
                { ALT: () =>{ this.SUBRULE(this.nVariable)}}
            ])
            this.CONSUME(CloseBrace)
        });
        private CardEffect=this.RULE("CardEffect", () => {
            this.CONSUME(tEffect )
            this.CONSUME(OpenBrace)
            this.SUBRULE(this.statements)
            this.CONSUME(CloseBrace)
        });
        private GameState=this.RULE("GameState", () => {
            this.CONSUME(tState )
            this.CONSUME(OpenBrace)
            this.SUBRULE(this.Declarations )
            this.CONSUME(CloseBrace)
        });
        private Players=this.RULE("Players", () => {
            this.CONSUME(tPlayer)
            this.CONSUME(tUserDefinedIdentifier)
            this.CONSUME(OpenBrace)
            this.SUBRULE(this.Actions )
            this.CONSUME( Turn)
            this.CONSUME( OpenBracket)
            this.CONSUME( CloseBracket)
            this.CONSUME2( OpenBrace)
            this.SUBRULE(this.statements )
            this.CONSUME2( CloseBrace)
            this.CONSUME(CloseBrace)
        });

        private Actions=this.RULE("Actions", () => {
            this.MANY(() => {
                this.OPTION(() => {
                    
                this.CONSUME(tAction)
                this.CONSUME(tUserDefinedIdentifier)
                this.CONSUME(OpenBracket)
                this.SUBRULE(this.FormalParameters)
                this.CONSUME(CloseBracket)
                this.CONSUME(OpenBrace)  
                this.SUBRULE(this.statements )
                this.CONSUME(CloseBrace)  
                this.SUBRULE(this.nCondition )
                this.CONSUME1(tUserDefinedIdentifier)
                this.CONSUME1(OpenBracket)
                this.SUBRULE1(this.FormalParameters)
                this.CONSUME1(CloseBracket)
                this.CONSUME1(OpenBrace)
                this.SUBRULE1(this.statements)
                this.CONSUME(tReturn)
                this.OR([
                    { ALT: () =>{ this.SUBRULE(this.Const )}}, 
                    { ALT: () =>{ this.SUBRULE(this.nVariable)}}
                ])
                this.CONSUME1(CloseBrace)
                });
        })
        });
        private FormalParameters=this.RULE("FormalParameters", () => {
            this.OPTION(() => {
                this.CONSUME(tUserDefinedIdentifier)
                this.SUBRULE(this.OtherFormalParameters);
            });
        });
        private OtherFormalParameters=this.RULE("OtherFormalParameters", () => {
            this.OPTION(() => {
                this.CONSUME(tUserDefinedIdentifier)
                this.SUBRULE(this.OtherFormalParameters);
            });
        });
        private End_Game=this.RULE("End_Game", () => {
            this.CONSUME(tEndgame)
            this.CONSUME(OpenBrace)
            this.SUBRULE(this.statements)
            this.CONSUME(tReturn)

            this.OR([
                { ALT: () =>{ this.SUBRULE(this.Const )}}, 
                { ALT: () =>{ this.SUBRULE(this.nVariable)}}
            ])

            this.CONSUME(CloseBrace)
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

                    { ALT: () =>{ this.CONSUME(tReturn )
                            this.SUBRULE(this.nVariable )}},
                ])
            });
        });
        private IO=this.RULE("IO", () => {
            
                this.OR([
                     
                        { ALT: () =>{ this.CONSUME(Input )
                            this.CONSUME(OpenBracket )
                            this.CONSUME(StringLiteral )
                            this.OPTION(() => {
                                this.CONSUME(Comma )
                            this.SUBRULE(this.nVariable )}
                              );
                            this.CONSUME(CloseBracket )
                        }},

                        { ALT: () =>{ 
                            this.CONSUME(ConsoleInput )
                            this.CONSUME2(OpenBracket )
                        this.CONSUME2(StringLiteral )
                        this.OPTION1(() => {
                            this.CONSUME1(Comma )
                            this.SUBRULE1(this.nVariable )}
                          );
                        this.CONSUME2(CloseBracket )
                    }},

                        

                        { ALT: () =>{ this.CONSUME(Print )
                            this.CONSUME3(OpenBracket )
                            this.SUBRULE(this.Expression)
                        this.CONSUME3(CloseBracket )
                        }},

                        { ALT: () =>{ this.CONSUME(ConsoleOutput )
                            this.CONSUME5(OpenBracket )
                            this.SUBRULE1(this.Expression)
                        this.CONSUME5(CloseBracket )
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
                        this.CONSUME(Minmax )
                        this.CONSUME(OpenBracket )
                        this.CONSUME(OpenBrace )
                        this.SUBRULE(this.statements)
                        this.CONSUME(CloseBrace )
                        this.CONSUME(CloseBracket )
                    }},
                    { 
                        ALT: () =>{ 
                        this.CONSUME(NeuralNetwork )
                        this.CONSUME1(OpenBracket )
                        this.CONSUME(StringLiteral )
                        this.CONSUME1(CloseBracket )
                    }},
                    ])
                    
                });


                private MethodCall=this.RULE("MethodCall", () => {
            
                    this.OR([

                        { 
                            ALT: () =>{ 
                            this.CONSUME(tEffect )
                            this.CONSUME(OpenBracket )
                            this.SUBRULE(this.Arguments )
                            this.CONSUME(CloseBracket )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(tCondition )
                                this.CONSUME1(OpenBracket )
                                this.SUBRULE1(this.Arguments )
                                this.CONSUME1(CloseBracket )
                        }},

                    ])
                    
                });
                private Loop=this.RULE("Loop", () => {
            
                    this.OR([

                        { 
                            ALT: () =>{ 
                            this.CONSUME(While )
                            this.CONSUME(OpenBracket )
                            this.SUBRULE(this.nCondition)
                            this.CONSUME(CloseBracket )
                            this.CONSUME(OpenBrace )
                            this.SUBRULE(this.statements)
                            this.CONSUME(CloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(For )
                                this.CONSUME1(OpenBracket )
                                this.SUBRULE(this.ForLoopInitialiser )
                                this.CONSUME(SemiColon )
                                this.SUBRULE(this.ForLoopCondition )
                                this.CONSUME1(SemiColon )
                                this.SUBRULE(this.ForLoopStep )
                                this.CONSUME1(CloseBracket )
                                this.CONSUME1(OpenBrace )
                                this.SUBRULE1(this.statements)
                                this.CONSUME1(CloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(Do )
                                this.CONSUME2(OpenBrace )
                                this.SUBRULE2(this.statements )
                                this.CONSUME2(CloseBrace )
                                this.CONSUME1(While )
                                this.CONSUME2(OpenBracket )
                                this.SUBRULE1(this.nCondition )
                                this.CONSUME2(CloseBracket )
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
                    this.CONSUME(If )
                    this.CONSUME(OpenBracket )
                    this.SUBRULE(this.nCondition)
                    this.CONSUME(CloseBracket )
                    this.CONSUME(OpenBrace )
                    this.SUBRULE(this.statements)
                    this.CONSUME(CloseBrace )
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
                            this.CONSUME(OpenBrace )
                            this.SUBRULE(this.statements)
                            this.CONSUME(CloseBrace )
                        }},
                    ])
                 });
                 private Declarations=this.RULE("Declarations", () => {
                    this.MANY(() => {
                    
                        
                        
                                this.CONSUME(tVariable)
                                this.SUBRULE(this.nVariable )
                                this.OPTION(() => {
                                    this.SUBRULE(this.Field )
                                })
                                this.CONSUME(Assign)
                                this.OR([
                                    { 
                                        ALT: () =>{ 
                                        this.SUBRULE(this.Const)
                                    }},
                                    { 
                                        ALT: () =>{ 
                                        this.SUBRULE(this.Declaration)
                                    }},
                                ])
                            })


                 });

                 private Declaration=this.RULE("Declaration", () => {
                                
            
                    this.CONSUME(tVariable)
                    this.CONSUME(tUserDefinedIdentifier)
                    this.SUBRULE(this.Field)
                });


                 private Assignment=this.RULE("Assignment", () => {
                    
                    this.SUBRULE(this.LHS )
                    this.CONSUME(Assign)
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
                            this.CONSUME(Break)
                        }},
                        { 
                            ALT: () =>{ 
                            this.CONSUME(Continue )
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
                            this.CONSUME(Minus)
                            this.CONSUME1(Minus)
                    }},
                    { 
                        ALT: () =>{ 
                            this.CONSUME(Plus)
                            this.CONSUME1(Plus)
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
                    this.CONSUME(tUserDefinedIdentifier)
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
                        this.CONSUME(Minus)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(Plus)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(Multiply)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(Divide)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(Mod)
                }}
            ])
});


        private Ternary=this.RULE("Ternary", () => {
                                
            
            this.CONSUME(QuestionMark)
            this.SUBRULE(this.Ternary_Instr )
            this.CONSUME(Colon)
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
                    this.CONSUME(OpenBracket)
                    this.SUBRULE(this.nCondition)
                    this.CONSUME(CloseBracket)
            }},
            { 
                ALT: () =>{ 
                    this.CONSUME(Not)
                    this.CONSUME1(OpenBracket)
                    this.SUBRULE1(this.nCondition)
                    this.CONSUME1(CloseBracket)
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
                        this.CONSUME(And)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(Or)
                }}
        ])
        });

        private Relational_Operator=this.RULE("Relational_Operator", () => {
                                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.CONSUME(LessThan)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(GreaterThan)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tLessThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tGreaterThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tEqual)
                }}
        ])
        });


        

        private Field=this.RULE("Field", () => {
                                
            this.OPTION(() => {
                this.CONSUME(OpenSquareBracket)
                this.SUBRULE(this.Index)
                this.CONSUME(ClosedSquareBracket)
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


        private Const=this.RULE("Const", () => {
                                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.CONSUME(tFloatLiteral)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(StringLiteral)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(True)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(False)
                }}
                ,
                { 
                    ALT: () =>{ 
                        this.CONSUME(IntegerLiteral)
                }}
        ])
        });

        
        private nVariable=this.RULE("nVariable", () => {
                                
            
            this.CONSUME(tUserDefinedIdentifier)
            this.OPTION(() => {
                this.SUBRULE(this.Field)
            })
        });

        private Type=this.RULE("Type", () => {
                                        
            
            this.CONSUME(tPlayer)
                
        
        });
        private Arguments=this.RULE("Arguments", () => {
                                        
            this.OPTION(() => {
                this.OR([
                    { 
                        ALT: () =>{ 
                            this.CONSUME(tUserDefinedIdentifier)
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
                                this.CONSUME(tUserDefinedIdentifier)
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


//visitor methods for the dsl

function visit(cstOutput:CstNode)
{
    
    let k: keyof typeof cstOutput.children;  // visit all children
        for (k in cstOutput.children) {
            const child = cstOutput.children[k];  // current child
            
            //decide what to do for specific childs

            const node = child[0] as unknown as CstNode;
            switch(node.name)//visit specific child node
            {
                case "GameState":
                    visitGameState(node);
                    break;
                case "Definition":
                    visit(node);
                    break;
                case "Cards":
                    visitCards(node);
                    break;
                case "Players":
                    visitPlayer(node);
                    break;
                case "End_Game":
                    visitEnd(node);
                    break;
                
            }
            

            
        }
}

function visitGameState(cstOutput:CstNode)
{
    //
    
    let k: keyof typeof cstOutput.children;  // visit all children
        for (k in cstOutput.children) {
            const child = cstOutput.children[k];

            const node = child[0] as unknown as CstNode;
            const token = child[0] as unknown as IToken;
            
            
            
            //if it a token decide how to write
            if(token.image)
            {
                switch(token.image)
                {
                    case "state":
                        break;
                    case "{":
                        break;    
                    case "}":
                        break; 
                    default:
                        //find the correct position
                        //write token to position
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//State")), token.image+ ' ', jsScript.slice(jsScript.indexOf("//State"))].join('');
                        
                        break;
                }
            }
            //if it is a node continue till token
            if(node.name == "Declarations")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//State")), '\n' , jsScript.slice(jsScript.indexOf("//State"))].join('');
                        
            }
            visitGameState(node);
            
        }

}
function visitCards(cstOutput:CstNode)
{
    //
    
}
function visitPlayer(cstOutput:CstNode)
{
    //
    let k: keyof typeof cstOutput.children;  // visit all children
        for (k in cstOutput.children) {
            const child = cstOutput.children[k];
            
            const node = child[0] as unknown as CstNode;
            const token = child[0] as unknown as IToken;


            if(token.tokenType)
            {
                switch(token.tokenType.name)
                {
                    case "Player":
                        break;
                    case "UserDefinedIdentifier":
                        //
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), "class "+token.image+ " extends player ", jsScript.slice(jsScript.indexOf("//players"))].join('');
                        //write to add players
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//add players")), "new "+token.image+ "(),", jsScript.slice(jsScript.indexOf("//add players"))].join('');
                        
                        break; 
                    case "CloseBracket":
                        //
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), token.image+ '{ ', jsScript.slice(jsScript.indexOf("//players"))].join('');
                        break;     
                    default:
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), token.image+ ' ', jsScript.slice(jsScript.indexOf("//players"))].join('');
                }
            }
            
            visitPlayerStatements(node);
            if(node.name == "statements")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), '}' , jsScript.slice(jsScript.indexOf("//players"))].join('');
                        
            }
        }
}
function visitPlayerStatements(cstOutput:CstNode)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        if(node.name == "statements")
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), '\n' , jsScript.slice(jsScript.indexOf("//players"))].join('');
                    
        }
        if(token.tokenType)
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), token.image + ' ', jsScript.slice(jsScript.indexOf("//players"))].join('');
        }
        visitPlayerStatements(node);

    }
}
function visitEnd(cstOutput:CstNode)
{
    //
    let k: keyof typeof cstOutput.children;  // visit all children
        for (k in cstOutput.children) {
            const child = cstOutput.children[k];
            const node = child[0] as unknown as CstNode;
            const token = child[0] as unknown as IToken;


            if(token.tokenType)
            {
                switch(token.tokenType.name)
                {
                    case "tEndgame":
                        break;
                    case "OpenBrace":
                        break; 
                    case "CloseBrace":
                        break;  
                    default:
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//end_game")), token.image+ ' ', jsScript.slice(jsScript.indexOf("//end_game"))].join('');
                }
            }
            
            visitEndStatements(node);
            if(node.name == "statements")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), '}' , jsScript.slice(jsScript.indexOf("//players"))].join('');
                        
            }

        }
}
function visitEndStatements(cstOutput:CstNode)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        
        if(token.tokenType)
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf("//end_game")), token.image + ' ', jsScript.slice(jsScript.indexOf("//end_game"))].join('');
        }
        visitPlayerStatements(node);
        if(node.name == "statements")
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf("//end_game")), '\n' , jsScript.slice(jsScript.indexOf("//end_game"))].join('');
                    
        }
    }
}
