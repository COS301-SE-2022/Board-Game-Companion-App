import { TokenType } from '@angular/compiler';
import { Injectable } from '@nestjs/common';
import { dot } from '@tensorflow/tfjs-layers/dist/exports_layers';
import * as chevrotain from 'chevrotain';
import {  CstNode, CstParser, IToken, tokenLabel } from 'chevrotain';
import * as fs from 'fs'
import { lexerResult } from '../../models/general/lexerResult';
import * as tokensStore from '../../models/general/tokens';
import { entity } from '../../models/general/entity';
import { throwError } from 'rxjs';

let scriptTemplate = "//State  //players   class script{\nplayers = [ //add players \n]}";


scriptTemplate = fs.readFileSync("templates/script.js","utf8");


  
    
  //geiing the script template into the var

let jsScript = scriptTemplate;

//user defined identifier



@Injectable()
export class CompilerService {

    errorLog = "";

    DSLparser = new parser();

    getProgramStructure(program:chevrotain.CstNode): entity{

        const result = {
            type: "root",
            name: "root",
            startLine: 0,
            endLine: 0,
            startPosition: 0,
            endPosition: 0,
            children: [],
            properties: []
        };
        
        const treeTraversal = (node:CstNode,parent:entity)=>{
            let k:string | null;
            let sub:string | null;

            for(k in node.children){
                const child = node.children[k][0] as chevrotain.CstNode;

                if(child.name){
                    switch(child.name){
                        case "GameState":{
                                const current:entity = {
                                    type: "state",
                                    name: "state",
                                    startLine: 0,
                                    endLine: 0,
                                    startPosition: 0,
                                    endPosition: 0,
                                    children: [],
                                    properties: []
                                }

                                parent.children.push(current);

                                for(sub in child.children){
                                    const node = child.children[sub][0] as chevrotain.CstNode;
                                    const token = child.children[sub][0] as IToken;

                                    if(node.name){
                                        treeTraversal(node,current)
                                    }else if(token.tokenType){
                                        switch(token.image){
                                            case "state":{
                                                current.startLine = token.startLine;
                                                current.startPosition = token.startColumn;
                                            }break;
                                            case "}":{
                                                current.endLine = token.endLine;
                                                current.endPosition = token.endColumn;
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        case "Definition":{
                            treeTraversal(child,parent);
                        }break;
                        case "Cards":
                            {
                                const current:entity = {
                                    type: "card",
                                    name: "card",
                                    startLine: 0,
                                    endLine: 0,
                                    startPosition: 0,
                                    endPosition: 0,
                                    children: [],
                                    properties: []
                                }

                                parent.children.push(current);

                                for(sub in child.children){
                                    const node = child.children[sub][0] as chevrotain.CstNode;
                                    const token = child.children[sub][0] as IToken;

                                    if(node.name){
                                        treeTraversal(node,current)
                                    }else if(token.tokenType){
                                        if(token.tokenType.name === "UserDefinedIdentifier")
                                            current.name = token.image;

                                        switch(token.image){
                                            case "card":{
                                                current.startLine = token.startLine;
                                                current.startPosition = token.startColumn;
                                            }break;
                                            case "}":{
                                                current.endLine = token.endLine;
                                                current.endPosition = token.endColumn;
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        case "Players":{
                            const current:entity = {
                                type: "player",
                                name: "player",
                                startLine: 0,
                                endLine: Number.MIN_VALUE,
                                startPosition: 0,
                                endPosition: Number.MIN_VALUE,
                                children: [],
                                properties: []
                            }

                            parent.children.push(current);

                            for(sub in child.children){
                                //console.log(child.children[sub][0])
                                const node = child.children[sub][0] as chevrotain.CstNode;
                                const token = child.children[sub][0] as IToken;

                                if(node.name){
                                    if(node.name === "PlayerTurn"){
                                        const turn:entity = {
                                            type: "turn",
                                            name: "turn",
                                            startLine: 0,
                                            endLine: 0,
                                            startPosition: 0,
                                            endPosition: 0,
                                            children: [],
                                            properties: []
                                        }
            
                                        current.children.push(turn);
            
                                        for(sub in node.children){
                                            const turnNode = node.children[sub][0] as chevrotain.CstNode;
                                            const token = node.children[sub][0] as IToken;
            
                                            if(turnNode.name){
                                                treeTraversal(turnNode,turn);
                                            }else if(token.tokenType){
                                                switch(token.image){
                                                    case "turn":{
                                                        turn.startLine = token.startLine;
                                                        turn.startPosition = token.startColumn;
                                                    }break;
                                                    case "}":{
                                                        turn.endLine = token.endLine;
                                                        turn.endPosition = token.endColumn;
                                                    }break;
                                                }
                                            }
                                        }         
                                    }else
                                        treeTraversal(node,current);
                                }else if(token.tokenType){
                                    if(token.tokenType.name === "UserDefinedIdentifier")
                                        current.name = token.image;

                                    switch(token.image){
                                        case "player":{
                                            current.startLine = token.startLine;
                                            current.startPosition = token.startColumn;
                                        }break;
                                        case "}":{
                                            current.endLine = token.endLine;
                                            current.endPosition = token.endColumn;
                                        }break;
                                    }
                                }
                            }
                        }break;
                        case "End_Game":{
                            const current:entity = {
                                type: "endgame",
                                name: "endgame",
                                startLine: 0,
                                endLine: 0,
                                startPosition: 0,
                                endPosition: 0,
                                children: [],
                                properties: []
                            }

                            parent.children.push(current);

                            for(sub in child.children){
                                const node = child.children[sub][0] as chevrotain.CstNode;
                                const token = child.children[sub][0] as IToken;

                                if(node.name){
                                    treeTraversal(node,current)
                                }else if(token.tokenType){

                                    switch(token.image){
                                        case "endgame":{
                                            current.startLine = token.startLine;
                                            current.startPosition = token.startColumn;
                                        }break;
                                        case "}":{
                                            current.endLine = token.endLine;
                                            current.endPosition = token.endColumn;
                                        }
                                    }
                                }
                            }
                        }break;
                        case "Actions":{
                            for(sub in child.children){
                                const node = child.children[sub][0] as chevrotain.CstNode;
                                treeTraversal(node,parent);
                            }
                        }break;
                        case "DefAction":{
                            // this.CONSUME(tokensStore.tAction)
                            // this.CONSUME(tokensStore.tUserDefinedIdentifier)
                            // this.CONSUME(tokensStore.tOpenBracket)
                            // this.SUBRULE(this.FormalParameters)
                            // this.CONSUME(tokensStore.tCloseBracket)
                            // this.CONSUME(tokensStore.tOpenBrace)  
                            // this.SUBRULE(this.statements )
                            // this.CONSUME(tokensStore.tCloseBrace)  
                            
                            const current:entity = {
                                type: "action",
                                name: "action",
                                startLine: 0,
                                endLine: 0,
                                startPosition: 0,
                                endPosition: 0,
                                children: [],
                                properties: []
                            }

                            parent.children.push(current);

                            for(sub in child.children){
                                const node = child.children[sub][0] as chevrotain.CstNode;
                                const token = child.children[sub][0] as IToken;

                                if(node.name){
                                    treeTraversal(node,current)
                                }else if(token.tokenType){
                                    if(token.tokenType.name === "UserDefinedIdentifier")
                                        current.name = token.image;

                                    switch(token.image){
                                        case "action":{
                                            current.startLine = token.startLine;
                                            current.startPosition = token.startColumn;
                                        }break;
                                        case "}":{
                                            current.endLine = token.endLine;
                                            current.endPosition = token.endColumn;
                                        }
                                    }
                                }
                            } 
                        }break;
                        case "DefCondition":{
                            // this.CONSUME(tokensStore.tCondition)
                            // this.CONSUME1(tokensStore.tOpenBracket)
                            // this.SUBRULE1(this.FormalParameters)
                            // this.CONSUME1(tokensStore.tCloseBracket)
                            // this.CONSUME1(tokensStore.tOpenBrace)
                            // this.SUBRULE1(this.Consideration)
                            // this.SUBRULE1(this.statements)
                            // this.CONSUME1(tokensStore.tCloseBrace)
                            const current:entity = {
                                type: "condition",
                                name: "condition",
                                startLine: 0,
                                endLine: 0,
                                startPosition: 0,
                                endPosition: 0,
                                children: [],
                                properties: []
                            }

                            current.name = parent.children[parent.children.length - 1].name;
                            parent.children.push(current);

                            for(sub in child.children){
                                const node = child.children[sub][0] as chevrotain.CstNode;
                                const token = child.children[sub][0] as IToken;

                                if(node.name){
                                    treeTraversal(node,current)
                                }else if(token.tokenType){

                                    switch(token.image){
                                        case "condition":{
                                            current.startLine = token.startLine;
                                            current.startPosition = token.startColumn;
                                        }break;
                                        case "}":{
                                            current.endLine = token.endLine;
                                            current.endPosition = token.endColumn;
                                        }
                                    }
                                }
                            }
                        }break;
                    }
                }
            }
        }

        treeTraversal(program,result);
        return result;
    }

    scanHelper(input:string):chevrotain.ILexingResult{
         const bannedTokens = ["window","var","console","document","eval"];
         const tokens:chevrotain.TokenType[] = tokensStore.AllTokens; 
         const lexer = new chevrotain.Lexer(tokens);

         const Tokenized = lexer.tokenize(input);

        
        // const isBanned = Tokenized.tokens.filter((value)=>{
        //     return bannedTokens.includes(value.image);
        // });

        // if(isBanned)
        // {
        //     throw Error("Unallowed UserIdentifier discovered -->"+isBanned[0].image);
        // }

        


        



        return Tokenized;
    }

    scan(input:string):lexerResult{
         const tokens:chevrotain.ILexingResult = this.scanHelper(input);
         const result:lexerResult = {
            success: true,
            errors: [],
        }

        if(tokens.errors.length !== 0){
            result.success = false;
            //result.errors = tokens.errors;
            console.log(tokens.errors)
        }

        return result;
    }

    parse(input:string):string{
        this.DSLparser.input = this.scanHelper(input).tokens;
         const cstOutput = this.DSLparser.Program();
        if(this.DSLparser.errors.length!=0)
        {
            throw Error(this.DSLparser.errors.toString());
        }

        //otherwise successful parse
        

        return "parse " + cstOutput;

        
    }


    transpile(input:string) 
    {

        this.errorLog = "";
        
        this.DSLparser.input = this.scanHelper(input).tokens;
        const cstOutput = this.DSLparser.Program();
        
        if(this.DSLparser.errors.length!=0)
        {
            const errMessage = (this.DSLparser.errors.toString()+" at line " +this.DSLparser.errors[0].token.startLine);
            
            throw errMessage;
        }
        else
        {
            //read in template file
            jsScript = scriptTemplate;
            //begin transpilation
            visit(cstOutput)
            
            //fs.writeFileSync("templates/tokens.json",JSON.stringify(this.getProgramStructure(cstOutput)));
            const programStructure = this.getProgramStructure(cstOutput)
            return {build:jsScript,programStructure:programStructure};
        }
    }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
class parser extends CstParser
{
    


    
    constructor() {
        

        
        super(tokensStore.AllTokens) //should allTokens

        this.performSelfAnalysis();
    }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
         this = this;
        
        
        public Program = this.RULE("Program", () => {
            
            this.SUBRULE(this.rTileAttributes )
            
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
            this.CONSUME(tokensStore.tCards)
            this.CONSUME(tokensStore.tUserDefinedIdentifier)
            this.CONSUME(tokensStore.tOpenBracket)
            this.SUBRULE(this.nParameters),
            this.CONSUME(tokensStore.tCloseBracket)
            this.CONSUME(tokensStore.tOpenBrace)
            
            this.SUBRULE(this.CardEffect )
            this.SUBRULE(this.CardCondition)
            this.CONSUME(tokensStore.tCloseBrace)
        });
        private nParameters =this.RULE("nParameters", () => {
            this.CONSUME(tokensStore.tParameters )
            this.CONSUME(tokensStore.tOpenBrace)
            this.SUBRULE(this.TypeList)
            this.CONSUME(tokensStore.tCloseBrace)
        });

        private TypeList=this.RULE("TypeList", () => {
                this.MANY(() => {
                this.OPTION(() => {
                    this.SUBRULE(this.Type)
                    this.CONSUME(tokensStore.tUserDefinedIdentifier)
                });
            })
        });
        private CardCondition= this.RULE("CardCondition", () => {
            this.CONSUME(tokensStore.tCondition )
            this.CONSUME(tokensStore.tOpenBrace)
            this.SUBRULE(this.statements)
            this.CONSUME(tokensStore.tCloseBrace)
        });
        private CardEffect=this.RULE("CardEffect", () => {
            this.CONSUME(tokensStore.tEffect )

            this.CONSUME(tokensStore.tOpenBrace)
            this.SUBRULE(this.statements)
            this.CONSUME(tokensStore.tCloseBrace)
        });
        private GameState=this.RULE("GameState", () => {
            this.CONSUME(tokensStore.tState )
            this.CONSUME(tokensStore.tOpenBrace)
            
            this.SUBRULE(this.Declarations )
            this.CONSUME(tokensStore.tCloseBrace)
        });
        private Players=this.RULE("Players", () => {
            this.CONSUME(tokensStore.tPlayer)
            this.CONSUME(tokensStore.tUserDefinedIdentifier)
            this.CONSUME(tokensStore.tOpenBrace)
            this.SUBRULE(this.Actions )
            this.SUBRULE(this.Declarations )
            this.SUBRULE(this.PlayerTurn)
            this.CONSUME(tokensStore.tCloseBrace)
        });
        private PlayerTurn=this.RULE("PlayerTurn",()=>{
            this.CONSUME(tokensStore.tTurn)
            this.CONSUME(tokensStore.tOpenBracket)
            this.CONSUME(tokensStore.tCloseBracket)
            this.CONSUME2(tokensStore.tOpenBrace)
            this.SUBRULE(this.statements )
            this.CONSUME(tokensStore.tCloseBrace)
        })
        private Actions=this.RULE("Actions", () => {
           
                this.OPTION(() => {
                    
                    this.SUBRULE(this.DefAction)

                    this.SUBRULE(this.DefCondition)

                    this.SUBRULE(this.Actions)
                });
        
        });
        private DefAction=this.RULE("DefAction", () => {
            //
            this.CONSUME(tokensStore.tAction)
                this.CONSUME(tokensStore.tUserDefinedIdentifier)
                this.CONSUME(tokensStore.tOpenBracket)
                this.SUBRULE(this.FormalParameters)
                this.CONSUME(tokensStore.tCloseBracket)
                this.CONSUME(tokensStore.tOpenBrace)  
                this.SUBRULE(this.statements )
                this.CONSUME(tokensStore.tCloseBrace)  
        })
        private DefCondition=this.RULE("DefCondition", () => {
            //
            this.CONSUME(tokensStore.tCondition)
                this.CONSUME1(tokensStore.tOpenBracket)
                this.SUBRULE1(this.FormalParameters)
                this.CONSUME1(tokensStore.tCloseBracket)
                this.CONSUME1(tokensStore.tOpenBrace)
                this.SUBRULE1(this.Consideration)
                this.SUBRULE1(this.statements)
                this.CONSUME1(tokensStore.tCloseBrace)
        })
        private Consideration=this.RULE("Consideration", () => {
            this.OPTION(() => {
                this.CONSUME(tokensStore.tConsider)
                this.CONSUME(tokensStore.tColon)
                this.SUBRULE(this.nVariable)
            })
        })
        private FormalParameters=this.RULE("FormalParameters", () => {
            this.OPTION(() => {
                this.CONSUME(tokensStore.tUserDefinedIdentifier)
                this.SUBRULE(this.OtherFormalParameters);
            });
        });
        private OtherFormalParameters=this.RULE("OtherFormalParameters", () => {
            this.OPTION(() => {
                this.CONSUME(tokensStore.tUserDefinedIdentifier)
                this.SUBRULE(this.OtherFormalParameters);
            });
        });
        private End_Game=this.RULE("End_Game", () => {
            this.CONSUME(tokensStore.tEndgame)
            this.CONSUME(tokensStore.tOpenBrace)
            this.SUBRULE(this.statements)
            

            this.CONSUME(tokensStore.tCloseBrace)
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

                    { ALT: () =>{ this.SUBRULE(this.Assignment )
                            this.SUBRULE5(this.statements)}},

                    { ALT: () =>{ this.SUBRULE(this.FlowControl )
                            this.SUBRULE6(this.statements)}},

                    { ALT: () =>{ this.CONSUME(tokensStore.tReturn )
                            this.SUBRULE(this.nVariable )}},
                ])
            });
        });
        private IO=this.RULE("IO", () => {
            
                this.OR([
                     
                        { ALT: () =>{ 
                            
                            
                            this.CONSUME(tokensStore.tInput )
                            this.CONSUME(tokensStore.tOpenBracket )
                            this.SUBRULE(this.Expression)
                            this.CONSUME(tokensStore.tComma)
                            this.CONSUME(tokensStore.tStringLiteral)
                            this.OPTION(() => {
                                this.CONSUME1(tokensStore.tComma)
                                this.CONSUME(tokensStore.tOpenSquareBracket)
                                this.SUBRULE(this.Array)
                                this.CONSUME(tokensStore.tClosedSquareBracket)
                            })
                            this.CONSUME(tokensStore.tCloseBracket )
                        }},

                        

                        

                        { ALT: () =>{ this.CONSUME(tokensStore.tPrint )
                            this.CONSUME3(tokensStore.tOpenBracket )
                            this.SUBRULE3(this.Expression)
                            this.OPTION1(() => {
                                this.CONSUME3(tokensStore.tComma )
                            this.SUBRULE3(this.Const)
                            })

                        this.CONSUME3(tokensStore.tCloseBracket )
                        }},

                        
                        { ALT: () =>{ this.CONSUME(tokensStore.tInputGroup )
                            this.CONSUME6(tokensStore.tOpenBracket )
                            this.SUBRULE5(this.Object)
                        this.CONSUME6(tokensStore.tCloseBracket )
                        }}
                    ])
                    
                });
                private Object=this.RULE("Object", () => {
                    //
                    this.OPTION(() => {
                        this.CONSUME(tokensStore.tOpenBracket )
                            this.SUBRULE(this.Expression)
                            this.CONSUME(tokensStore.tComma)
                            this.SUBRULE(this.Const)
                            this.OPTION1(() => {
                                this.CONSUME1(tokensStore.tComma)
                                this.CONSUME(tokensStore.tOpenSquareBracket)
                                this.SUBRULE(this.Array)
                                this.CONSUME(tokensStore.tClosedSquareBracket)
                            })
                            this.CONSUME(tokensStore.tCloseBracket )
                            this.SUBRULE(this.AnotherObject)
                        })
                })
                private AnotherObject=this.RULE("AnotherObject", () => {
                    //
                    this.OPTION(() => {
                        this.CONSUME(tokensStore.tComma )
                        this.SUBRULE(this.Object)
                    })
                })

                private Array=this.RULE("Array", () => {
                    //
                    this.OPTION(() => {
                        this.OPTION1(() => {
                            this.CONSUME1(tokensStore.tComma)
                        })
                        this.OR([
                     
                            { ALT: () =>{ 
                                this.SUBRULE(this.Const)
                            }},
                            { ALT: () =>{ 
                                this.CONSUME(tokensStore.tUserDefinedIdentifier)
                            }}

                        ])

                        this.SUBRULE(this.Array)

                    })
                })
                private Call=this.RULE("Call", () => {
            
                    this.OR([
                    { 
                        ALT: () =>{ 
                        this.SUBRULE(this.MethodCall)
                    }},
                    { 
                        ALT: () =>{ 
                        this.CONSUME(tokensStore.tMinmax )
                        this.CONSUME(tokensStore.tOpenBracket )
                        this.CONSUME(tokensStore.tOpenBrace )
                        this.SUBRULE(this.statements)
                        this.CONSUME(tokensStore.tCloseBrace )
                        this.CONSUME(tokensStore.tCloseBracket )
                    }},
                    { 
                        ALT: () =>{ 
                        this.CONSUME(tokensStore.tNeuralNetwork )
                        this.CONSUME1(tokensStore.tOpenBracket )
                        this.SUBRULE(this.Expression)
                        this.SUBRULE(this.Continuation)
                        this.CONSUME1(tokensStore.tCloseBracket )
                    }},
                    ])
                    
                });
                private Continuation=this.RULE("Continuation", () => {
                    //
                    this.CONSUME1(tokensStore.tComma )
                    this.SUBRULE(this.Expression)
                })

                private MethodCall=this.RULE("MethodCall", () => {
            
                    this.OR([

                        { 
                            ALT: () =>{ 
                            this.CONSUME(tokensStore.tEffect )
                            this.CONSUME(tokensStore.tOpenBracket )
                            this.SUBRULE(this.Arguments )
                            this.CONSUME(tokensStore.tCloseBracket )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(tokensStore.tCondition )
                                this.CONSUME1(tokensStore.tOpenBracket )
                                this.SUBRULE1(this.Arguments )
                                this.CONSUME1(tokensStore.tCloseBracket )
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.rCreateCard)
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.rGetTileByID)
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.rGetTilesByType) 
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.SpecialMethods) 
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.rGenerateChoices) 
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.rChooseAction) 
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.rIsActionLegal) 
                            
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.rCopy) 
                            
                        }},
                        { 
                            ALT: () =>{ 
                                this.SUBRULE(this.rGetBoard) 
                            
                        }},
                    ])
                    
                });
                private rGetBoard=this.RULE("rGetBoard", () => {
                    this.CONSUME(tokensStore.tGetBoard )
                    this.CONSUME2(tokensStore.tOpenBracket )
                    this.CONSUME2(tokensStore.tCloseBracket )
                })
                private rCreateCard=this.RULE("rCreateCard", () => {
                    this.CONSUME(tokensStore.tCreateCard )
                    this.CONSUME3(tokensStore.tOpenBracket )
                    this.SUBRULE(this.Expression)
                    this.CONSUME3(tokensStore.tCloseBracket )
                })
                private rCopy=this.RULE("rCopy", () => {
                    this.CONSUME(tokensStore.tCopy )
                    this.CONSUME4(tokensStore.tOpenBracket )
                    this.SUBRULE(this.Expression)
                    this.CONSUME4(tokensStore.tCloseBracket )
                })


                private rChooseAction=this.RULE("rChooseAction", () => {
                    this.CONSUME(tokensStore.tChooseAction)
                    this.CONSUME(tokensStore.tOpenBracket )
                    this.SUBRULE(this.Expression)
                    this.CONSUME(tokensStore.tComma )
                    this.SUBRULE(this.Value) 
                    this.SUBRULE(this.dotContinuation) 
                    this.CONSUME(tokensStore.tCloseBracket )
                })
                private rIsActionLegal=this.RULE("rIsActionLegal", () => {
                    this.CONSUME(tokensStore.tIsActionLegal)
                    this.CONSUME(tokensStore.tOpenBracket )
                    this.SUBRULE(this.Expression)
                    this.CONSUME(tokensStore.tComma )
                    this.SUBRULE(this.Value) 
                    this.SUBRULE(this.dotContinuation) 
                    this.CONSUME(tokensStore.tCloseBracket )
                })


                private rGenerateChoices=this.RULE("rGenerateChoices", () => {
                    this.CONSUME(tokensStore.tGenerateChoices)
                    this.CONSUME(tokensStore.tOpenBracket )
                    this.CONSUME(tokensStore.tCloseBracket )
                })
                private rAddPieceToTile=this.RULE("rAddPieceToTile", () => {
                    this.CONSUME(tokensStore.tAddPieceToTile )
                                this.CONSUME(tokensStore.tOpenBracket )
                                this.CONSUME(tokensStore.tUserDefinedIdentifier )
                                this.CONSUME(tokensStore.tComma )
                                this.SUBRULE(this.Value)
                                this.CONSUME(tokensStore.tCloseBracket )
                })

                private rGetTileByID=this.RULE("rGetTileByID", () => {
                                this.CONSUME(tokensStore.tGetTileByID )
                                this.CONSUME2(tokensStore.tOpenBracket )
                                this.SUBRULE(this.Expression)
                                this.CONSUME2(tokensStore.tCloseBracket )
                })
                private rGetTilesByType=this.RULE("rGetTilesByType", () => {
                    this.CONSUME(tokensStore.tGetTilesByType )
                                this.CONSUME3(tokensStore.tOpenBracket )
                                this.SUBRULE1(this.Expression)
                                this.CONSUME3(tokensStore.tCloseBracket )
                    })

                private Loop=this.RULE("Loop", () => {
            
                    this.OR([

                        { 
                            ALT: () =>{ 
                            this.CONSUME(tokensStore.tWhile )
                            this.CONSUME(tokensStore.tOpenBracket )
                            this.SUBRULE(this.nCondition)
                            this.CONSUME(tokensStore.tCloseBracket )
                            this.CONSUME(tokensStore.tOpenBrace )
                            this.SUBRULE(this.statements)
                            this.CONSUME(tokensStore.tCloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(tokensStore.tFor )
                                this.CONSUME1(tokensStore.tOpenBracket )
                                this.SUBRULE(this.ForLoopInitialiser )
                                this.CONSUME(tokensStore.tSemiColon )
                                this.SUBRULE(this.ForLoopCondition )
                                
                                this.SUBRULE(this.ForLoopStep )
                                this.CONSUME1(tokensStore.tCloseBracket )
                                this.CONSUME1(tokensStore.tOpenBrace )
                                this.SUBRULE1(this.statements)
                                this.CONSUME1(tokensStore.tCloseBrace )
                        }},
                        { 
                            ALT: () =>{ 
                                this.CONSUME(tokensStore.tDo )
                                this.CONSUME2(tokensStore.tOpenBrace )
                                this.SUBRULE2(this.statements )
                                this.CONSUME2(tokensStore.tCloseBrace )
                                this.CONSUME1(tokensStore.tWhile )
                                this.CONSUME2(tokensStore.tOpenBracket )
                                this.SUBRULE1(this.nCondition )
                                this.CONSUME2(tokensStore.tCloseBracket )
                        }},
                    ])
                    
                });

                private ForLoopInitialiser=this.RULE("ForLoopInitialiser", () => {
                    this.OPTION(() => {
                        this.SUBRULE(this.nVariable)
                        this.this.CONSUME(tokensStore.tAssign)
                        this.SUBRULE(this.Value)
                    })
                });


                private ForLoopCondition=this.RULE("ForLoopCondition", () => {
                    
                   this.SUBRULE(this.nCondition)
                    
                });
                private ForLoopStep=this.RULE("ForLoopStep", () => {
                    this.CONSUME1(tokensStore.tSemiColon )
                    this.SUBRULE(this.nVariable)
                    this.SUBRULE(this.Unary_Operator)
                     
                 });
                 private Branch=this.RULE("Branch", () => {
                    this.CONSUME(tokensStore.tIf )
                    this.CONSUME(tokensStore.tOpenBracket )
                    this.SUBRULE(this.nCondition)
                    this.CONSUME(tokensStore.tCloseBracket )
                    this.CONSUME(tokensStore.tOpenBrace )
                    this.SUBRULE(this.statements)
                    this.CONSUME(tokensStore.tCloseBrace )
                    this.SUBRULE(this.Alternative)


                 });
                 private Alternative=this.RULE("Alternative", () => {
                    this.OPTION(() => {
                        this.CONSUME(tokensStore.tElse)
                    
                        this.OR([
                            { 
                                ALT: () =>{ 
                                this.SUBRULE(this.Branch)
                            }},
                            { 
                                ALT: () =>{ 
                                this.CONSUME(tokensStore.tOpenBrace )
                                this.SUBRULE(this.statements)
                                this.CONSUME(tokensStore.tCloseBrace )
                            }},
                        ])
                    })
                 });
                 private Declarations=this.RULE("Declarations", () => {
                    this.OPTION(() => {
                        this.SUBRULE(this.SpecialMethods )
                    })
                    this.OPTION1(() => {

                                this.SUBRULE(this.nVariable )
                                
                                this.OPTION2(() => {
                                    this.SUBRULE(this.Field )
                                })


                                this.CONSUME(tokensStore.tAssign)
                                this.OR2([
                                    { 
                                        ALT: () =>{ 
                                        this.SUBRULE(this.Const)
                                    }},
                                    { 
                                        ALT: () =>{ 
                                        this.SUBRULE(this.Declaration)
                                    }},
                                    { 
                                        ALT: () =>{ 
                                        this.CONSUME(tokensStore.tTile)
                                    }},
                                    { 
                                        ALT: () =>{ 
                                        this.CONSUME(tokensStore.tPiece)
                                    }},
                                ])
                            

                                this.SUBRULE(this.Declarations )
                            })

                 });
                 private SpecialMethods=this.RULE("SpecialMethods", () => {
                    this.OR([
                        { 
                            ALT: () =>{
                                this.SUBRULE(this.addTileToBoard )
                            }},
                            {
                            ALT: () =>{
                                this.SUBRULE(this.addAdj )
                            }},
                            {ALT: () =>{
                                this.SUBRULE(this.rAddPieceToTile )
                            }},
                            {ALT: () =>{
                                this.SUBRULE(this.rAddToArr )
                            }}
                            ,
                            {ALT: () =>{
                                this.SUBRULE(this.rCreateBoard )
                            }}
                            ,
                            {ALT: () =>{
                                this.SUBRULE(this.rToInt )
                            }}
                        ])
                 })
                 
                 private rToInt=this.RULE("rToInt", () => {
                    this.OPTION(() =>{
                        this.CONSUME(tokensStore.tToInt)
                        this.CONSUME(tokensStore.tOpenBrace )
                        this.SUBRULE(this.Declarations)
                        this.CONSUME(tokensStore.tCloseBrace )
                    })
                 })
                 private rTileAttributes=this.RULE("rTileAttributes", () => {
                    this.OPTION(() =>{
                        this.CONSUME(tokensStore.tTileAttributes)
                        this.CONSUME(tokensStore.tOpenBrace )
                        this.SUBRULE(this.Declarations)
                        this.CONSUME(tokensStore.tCloseBrace )
                    })
                 })

                 private rCreateBoard=this.RULE("rCreateBoard", () => {
                    this.CONSUME(tokensStore.tCreateBoard )
                    this.CONSUME(tokensStore.tOpenBracket )
                    this.SUBRULE(this.Const)
                    this.OPTION2(() => {
                        this.CONSUME(tokensStore.tComma )
                        this.SUBRULE2(this.Const)
                    })
                    this.CONSUME(tokensStore.tCloseBracket )
                 })
                 private rAddToArr=this.RULE("rAddToArr", () => {
                    this.CONSUME(tokensStore.tAddToArr )
                    this.CONSUME(tokensStore.tOpenBracket )
                    this.CONSUME(tokensStore.tUserDefinedIdentifier )
                    this.CONSUME(tokensStore.tComma )
                    this.SUBRULE(this.Value)
                    this.CONSUME(tokensStore.tCloseBracket )
                 })

                 private addTileToBoard=this.RULE("addTileToBoard", () => {
                    
                    this.CONSUME(tokensStore.tAddToBoard)
                    this.CONSUME(tokensStore.tOpenBracket)
                    this.CONSUME(tokensStore.tUserDefinedIdentifier)
                    this.CONSUME(tokensStore.tCloseBracket)    
                 })
                 private addAdj=this.RULE("addAdj", () => {
                    
                    this.CONSUME(tokensStore.tAddAdjacency)
                    this.CONSUME(tokensStore.tOpenBracket)
                    this.CONSUME(tokensStore.tUserDefinedIdentifier)
                    this.CONSUME(tokensStore.tComma)
                    this.CONSUME2(tokensStore.tUserDefinedIdentifier)
                    this.CONSUME(tokensStore.tCloseBracket)    
                 })


                 private Declaration=this.RULE("Declaration", () => {
                                
            
                    this.CONSUME(tokensStore.tVariable)
                    this.CONSUME(tokensStore.tUserDefinedIdentifier)
                    this.SUBRULE(this.Field)
                });


                 private Assignment=this.RULE("Assignment", () => {
                    
                    this.SUBRULE(this.LHS )
                    
                    this.CONSUME(tokensStore.tAssign)
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
                            }},
                            { 
                                ALT: () =>{ 
                                this.SUBRULE(this.IO )
                            }},
                            { 
                                ALT: () =>{ 
                                this.CONSUME(tokensStore.tPiece)
                            }},
                            { 
                                ALT: () =>{ 
                                this.CONSUME(tokensStore.tOpenSquareBracket)
                                this.SUBRULE(this.Array)
                                this.CONSUME(tokensStore.tClosedSquareBracket)
                            }}
                    ])
                });
                


                private FlowControl=this.RULE("FlowControl", () => {
                        
                    this.OR([
                        { 
                            ALT: () =>{ 
                            this.CONSUME(tokensStore.tBreak)
                        }},
                        { 
                            ALT: () =>{ 
                            this.CONSUME(tokensStore.tContinue )
                        }}
                ])
            });
            private Expression=this.RULE("Expression", () => {
                this.OPTION(() => {
                    this.SUBRULE1(this.Unary_Operator)
                })
                this.SUBRULE(this.Value) 
                this.SUBRULE(this.dotContinuation)    
                this.OPTION1(() => {
                            this.OR1([
                            
                            {
                                ALT: () =>{ 
                                    this.SUBRULE(this.Binary)
                                }
                            },
                            { 
                                ALT: () =>{ 
                                    this.OPTION2(() => {
                                    this.SUBRULE(this.Relational_Operator)
                                    this.SUBRULE2(this.Value)
                                    })
                                    this.OPTION3(() => {
                                        this.SUBRULE(this.Ternary)
                                    })
                                    
                            }},
                        ])
                })
            
        });
        private dotContinuation=this.RULE("dotContinuation", () => {
            //
            this.OPTION(() => {
                this.CONSUME(tokensStore.tDot)
                this.SUBRULE(this.Value) 
                this.SUBRULE(this.dotContinuation) 
            })
        })


        private Unary=this.RULE("Unary", () => {
            this.SUBRULE(this.Unary_Operator)
          
        
    });
            private Unary_Operator=this.RULE("Unary_Operator", () => {
                                
                this.OR([
                    { 
                        ALT: () =>{ 
                            this.CONSUME(tokensStore.tMinus)
                            this.SUBRULE(this.SecondMinus)
                    }},
                    { 
                        ALT: () =>{ 
                            this.CONSUME(tokensStore.tPlus)
                            this.SUBRULE(this.SecondPlus)
                    }}
            ])
        });
        private SecondPlus=this.RULE("SecondPlus", () => {
            this.CONSUME1(tokensStore.tPlus)
        });
        private SecondMinus=this.RULE("SecondMinus", () => {
            this.CONSUME1(tokensStore.tMinus)
        });
        private Binary=this.RULE("Binary", () => {
                        
            this.SUBRULE(this.BinaryOperator)
            this.SUBRULE1(this.Expression)
    });
    private  Value = this.RULE("Value", () => {
        this.OR([
            { 
                ALT: () =>{ 
                    this.SUBRULE(this.Const)
            }},
            { 
                ALT: () =>{ 
                    this.CONSUME(tokensStore.tUserDefinedIdentifier)
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
                        this.CONSUME(tokensStore.tMinus)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tPlus)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tMultiply)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tDivide)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tMod)
                }}
            ])
});


        private Ternary=this.RULE("Ternary", () => {
                                
            
            this.CONSUME(tokensStore.tQuestionMark)
            this.SUBRULE(this.Ternary_Instr )
            this.CONSUME(tokensStore.tColon)
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
                    this.CONSUME(tokensStore.tOpenBracket)
                    this.SUBRULE(this.nCondition)
                    this.CONSUME(tokensStore.tCloseBracket)
            }},
            { 
                ALT: () =>{ 
                    this.CONSUME(tokensStore.tNot)
                    this.CONSUME1(tokensStore.tOpenBracket)
                    this.SUBRULE1(this.nCondition)
                    this.CONSUME1(tokensStore.tCloseBracket)
            }},
            { 
                ALT: () =>{ 
                    this.SUBRULE(this.nVariable)
                    this.OPTION(() => {
                            this.SUBRULE(this.Relational_Operator  )
                            this.SUBRULE(this.Expression)
                    })
                    
                    
            }},
            { 
                ALT: () =>{ 
                    this.SUBRULE(this.Const)
                    this.OPTION1(() => {
                            this.SUBRULE1(this.Relational_Operator)
                            this.SUBRULE1(this.Expression)
                    })
                    
                    
            }}
    ])

    this.OPTION2(() => {
        this.SUBRULE1(this.Logical_Operator )
        this.SUBRULE3(this.nCondition)
    })
});

        

        private Logical_Operator=this.RULE("Logical_Operator", () => {
                                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tAnd)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tOr)
                }}
        ])
        });

        private Relational_Operator=this.RULE("Relational_Operator", () => {
                                        
            this.OR([
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tLessThan)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tGreaterThan)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tLessThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tGreaterThanOrEqual)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tEqual)
                }}
                ,
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tNotEqual)
                }}
        ])
        });


        

        private Field=this.RULE("Field", () => {
                                
            this.OPTION(() => {
                this.CONSUME(tokensStore.tOpenSquareBracket)
                this.SUBRULE(this.Index)
                this.CONSUME(tokensStore.tClosedSquareBracket)
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
                        this.CONSUME(tokensStore.tFloatLiteral)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tStringLiteral)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tTrue)
                }},
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tFalse)
                }}
                ,
                { 
                    ALT: () =>{ 
                        this.CONSUME(tokensStore.tIntegerLiteral)
                }}
        ])
        });

        
        private nVariable=this.RULE("nVariable", () => {
            this.OPTION(() => {                 
            this.OR([
                {
                    ALT: () =>{ 
                    this.CONSUME(tokensStore.tVariable)
                    }
                },
                {
                    ALT: () =>{ 
                    this.CONSUME(tokensStore.tLet)
                    }
                }
            ])
        })
            this.CONSUME(tokensStore.tUserDefinedIdentifier)
            this.OPTION2(() => {
                this.SUBRULE(this.Field)
            })
            this.OPTION3(() => {
                this.CONSUME(tokensStore.tDot)
                this.SUBRULE(this.nVariable)
                
            })

        });

        private Type=this.RULE("Type", () => {
                                        
            
            this.CONSUME(tokensStore.tPlayer)
                
        
        });
        private Arguments=this.RULE("Arguments", () => {
                                        
            this.OPTION(() => {
                this.OR([
                    { 
                        ALT: () =>{ 
                            this.CONSUME(tokensStore.tUserDefinedIdentifier)
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
                                this.CONSUME(tokensStore.tUserDefinedIdentifier)
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
                case "rTileAttributes":
                    visitTileAttributes(node)
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
                

                
                if(token.tokenType.name != "StringLiteral")
                {
                    switch(token.image)
                    {
                        case "state":
                            break;
                        case "{":
                            break;    
                        case "}":
                            break; 
                        case "var":
                            break;
                        case "tile":
                            jsScript = [jsScript.slice(0, jsScript.indexOf("//State")), 'new tile()\n' , jsScript.slice(jsScript.indexOf("//State"))].join('');
                                
                            break;
                        case "Dot":
                                jsScript = [jsScript.slice(0, jsScript.indexOf("//State")-1), token.image+ '', jsScript.slice(jsScript.indexOf("//State"))].join('');
                                break;
                        default:
                            jsScript = [jsScript.slice(0, jsScript.indexOf("//State")), token.image+ ' ', jsScript.slice(jsScript.indexOf("//State"))].join('');
                            
                            break;
                    }
                }
                else
                {
                    jsScript = [jsScript.slice(0, jsScript.indexOf("//State")), token.image, jsScript.slice(jsScript.indexOf("//State"))].join('');
                            
                }
            }
            //if it is a node continue till token
            
            if(node.name == "Declarations")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//State")), '\n' , jsScript.slice(jsScript.indexOf("//State"))].join('');
                        
            }
            if(node.name != "SpecialMethods")
            {
                
                
                visitGameState(node);
                
            }
            else
            {
                specialVisit(node, "//tiles")
            }
            
            
        }

}
function visitTileAttributes(cstOutput:CstNode)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];

        const node = child[0] as unknown as CstNode;

        if(node.name)
        {
            visitPlayerStatements(node, "//tile properties");
        }
    }
}
function visitCards(cstOutput:CstNode)
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
                    case "UserDefinedIdentifier":
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//cardEffect")), "async "+token.image+"(parameters){", jsScript.slice(jsScript.indexOf("//cardEffect"))].join('');
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//cardCondition")), "async "+token.image+"(parameters){", jsScript.slice(jsScript.indexOf("//cardCondition"))].join('');
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//cardActivation")), "case \""+token.image+"\":\n await"+token.image+"(parameters)\n", jsScript.slice(jsScript.indexOf("//cardActivation"))].join('');
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//cardUsable")), "case \""+token.image+"\":\n await"+token.image+"(parameters)\n", jsScript.slice(jsScript.indexOf("//cardUsable"))].join('');
                        
                        break;
                    case "tCards":
                        break;
                    default:
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//cards")), token.image+ " ", jsScript.slice(jsScript.indexOf("//cards"))].join('');
                        break;

                }
            }

        if(node.name)
        {
            switch(node.name)
                {
                    case "nParameters":
                        visitParams(node)
                        break;
                    case "CardEffect":
                        visitEffect(node)
                        break;    
                    case "CardCondition":
                        visitCondition(node)
                        break; 
                }
        }
    }
    
    
}
function visitParams(cstOutput:CstNode)
{
    //
}
function visitEffect(cstOutput:CstNode)
{
    //
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];

        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;


        if(node.name)
            {
                visitPlayerStatements(node, "//cardEffect");
            }

    }
    jsScript = [jsScript.slice(0, jsScript.indexOf("//cardEffect")),"}\n", jsScript.slice(jsScript.indexOf("//cardEffect"))].join('');
                         
}
function visitCondition(cstOutput:CstNode)
{
    //
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];

        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;


        if(node.name)
            {
                visitPlayerStatements(node, "//cardCondition");
            }

    }
    jsScript = [jsScript.slice(0, jsScript.indexOf("//cardCondition")),"}\n", jsScript.slice(jsScript.indexOf("//cardCondition"))].join('');
    
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
                        
                    case "Turn":
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), 'async '+token.image+ ' ', jsScript.slice(jsScript.indexOf("//players"))].join('');
                        break;
                    default:
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), token.image+ ' ', jsScript.slice(jsScript.indexOf("//players"))].join('');
                }
            }
            if(node.name  == "Actions")
            {
                visitPlayerActions(node,0);
                //clean up
                jsScript=jsScript.replace('//actionnums', '');
                jsScript=jsScript.replace('//actions', '');
                jsScript=jsScript.replace('//actioncond', '');
                jsScript=jsScript.replace('//action cases', '');
                jsScript=jsScript.replace('//condition cases', '');
                jsScript=jsScript.replace('//considerations cases', '');
            }
            else
            {
                visitPlayerStatements(node, "//player");
            }
            
            if(node.name == "statements")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), '}' , jsScript.slice(jsScript.indexOf("//players"))].join('');
                        
            }
            if(node.name == "Declarations")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), ';' , jsScript.slice(jsScript.indexOf("//players"))].join('');
                        
            }
        }
        
                            
}
function visitPlayerActions(cstOutput:CstNode, i:number)
{
    //here
    if(i<1)
    {
        const ActionTemplate = fs.readFileSync("templates/ActionTemplate.js","utf8");
        jsScript = [jsScript.slice(0, jsScript.indexOf("//players")), ActionTemplate , jsScript.slice(jsScript.indexOf("//players"))].join('');
                
    }
    
        //
        let k: keyof typeof cstOutput.children;  // visit all children
        for (k in cstOutput.children) {
            const child = cstOutput.children[k];
            
            const node = child[0] as unknown as CstNode;

            if(node.name)
            {
                if(node.name == "DefAction")
                {
                    visitDefActions(node, i)
                    
                }
                if(node.name == "DefCondition")
                {
                    visitDefCondition(node, i)
                    
                }
                if(node.name  == "Actions")
                {
                    visitPlayerActions(node,i+1);
                }
            }
        }
    

}
function visitDefActions(cstOutput:CstNode, i:number)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        
        if(token.tokenType)
        {
            if(token.tokenType.name == "Action")
            {
                //
            }
            if(token.tokenType.name == "UserDefinedIdentifier")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//actionnums")), "\""+token.image+"\"," , jsScript.slice(jsScript.indexOf("//actionnums"))].join('');
                jsScript = [jsScript.slice(0, jsScript.indexOf("//action cases")),'case '+ "\""+token.image+"\""+':\n' , jsScript.slice(jsScript.indexOf("//action cases"))].join('');
                jsScript = [jsScript.slice(0, jsScript.indexOf("//condition cases")),'case '+ "\""+token.image+"\""+':\n' , jsScript.slice(jsScript.indexOf("//condition cases"))].join('');
                


                jsScript = [jsScript.slice(0, jsScript.indexOf("//action cases")),'await this.'+token.image+'(' , jsScript.slice(jsScript.indexOf("//action cases"))].join('');
                jsScript = [jsScript.slice(0, jsScript.indexOf("//condition cases")),'return await this.'+token.image+'Cond(', jsScript.slice(jsScript.indexOf("//condition cases"))].join('');
                jsScript = [jsScript.slice(0, jsScript.indexOf("//actioncond")),'\nasync '+token.image+'Cond', jsScript.slice(jsScript.indexOf("//actioncond"))].join('');
                jsScript = [jsScript.slice(0, jsScript.indexOf("//actions")),' async ', jsScript.slice(jsScript.indexOf("//actions"))].join('');
                
                
            }
            if(token.tokenType.name == "CloseBracket")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//action cases")),token.image+'\nbreak\n' , jsScript.slice(jsScript.indexOf("//action cases"))].join('');
                jsScript = [jsScript.slice(0, jsScript.indexOf("//condition cases")),token.image+'\nbreak\n', jsScript.slice(jsScript.indexOf("//condition cases"))].join('');
                
            }
            if(token.tokenType.name != "Action")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//actions")),''+token.image+' ', jsScript.slice(jsScript.indexOf("//actions"))].join('');
                
            }
        }
        if(node.name)
        {
            if(node.name == "FormalParameters")
            {
                let i: keyof typeof node.children;  // visit all children
                for (i in node.children) {
                    const childi = node.children[i];
                    const tokeni = childi[0] as unknown as IToken;
                    if(tokeni.tokenType)
                    {
                        
                        if(tokeni.tokenType.name == "UserDefinedIdentifier")
                        {
                            
                            jsScript = [jsScript.slice(0, jsScript.indexOf("//action cases")),'p' , jsScript.slice(jsScript.indexOf("//action cases"))].join('');
                            jsScript = [jsScript.slice(0, jsScript.indexOf("//condition cases")),'p' , jsScript.slice(jsScript.indexOf("//condition cases"))].join('');
                            jsScript = [jsScript.slice(0, jsScript.indexOf("//actions")),tokeni.image+' ', jsScript.slice(jsScript.indexOf("//actions"))].join('');
                        }
                    }
                }
            }
            if(node.name == "statements")
            {
                visitPlayerStatements(node, "//actions")
            }
        }
    }
}

function visitDefCondition(cstOutput:CstNode, i:number)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;

        if(token.tokenType)
        {
            if(token.tokenType.name != "Condition")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//actioncond")),token.image+' ', jsScript.slice(jsScript.indexOf("//actioncond"))].join('');
                
            }
        }

        if(node.name)
        {
            if(node.name != "Consideration")
            {
                visitPlayerStatements(node, "//actioncond")
            }
            else
            {
                //
                jsScript = [jsScript.slice(0, jsScript.indexOf("//considerations cases")),'case '+i+':\n return ', jsScript.slice(jsScript.indexOf("//considerations cases"))].join('');
                const val = jsScript.indexOf("//considerations cases");
                visitConsideration(node, i)
                if(val == jsScript.indexOf("//considerations cases"))
                {
                    //nothing was written
                    jsScript = [jsScript.slice(0, jsScript.indexOf("//considerations cases")),'[]', jsScript.slice(jsScript.indexOf("//considerations cases"))].join('');
                
                }

                jsScript = [jsScript.slice(0, jsScript.indexOf("//considerations cases")),'\nbreak\n', jsScript.slice(jsScript.indexOf("//considerations cases"))].join('');
                
            }
        }
    }
}
function visitConsideration(cstOutput:CstNode, i:number)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;

        if(token.tokenType)
        {
            if(token.tokenType.name != "consider" && token.tokenType.name != "Colon")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//considerations cases")),token.image+'', jsScript.slice(jsScript.indexOf("//considerations cases"))].join('');
                
            }
        }
        if(node.name)
        {
            visitConsideration(node, i)
        }
    }
}

function visitPlayerStatements(cstOutput:CstNode, place:string)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        if(node.name == "statements")
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), '\n' , jsScript.slice(jsScript.indexOf(place))].join('');
                    
        }

        if(token.tokenType)
        {
            
                
            
            switch(token.tokenType.name)
            {
                
                case "Variable": 
                    break;
                case "Turn":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'async '+token.image+ ' ', jsScript.slice(jsScript.indexOf(place))].join('');
                    break;
                case "Input":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'await input', jsScript.slice(jsScript.indexOf(place))].join('');
                    break;
                case "Print":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'await output', jsScript.slice(jsScript.indexOf(place))].join('');
                    break;   
                case "NeuralNetwork":
                        jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'await '+token.image, jsScript.slice(jsScript.indexOf(place))].join('');
                        break; 
                case "StringLiteral":
                    if(token.image.includes('\''))
                    {
                        jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image, jsScript.slice(jsScript.indexOf(place))].join('');
                    
                    }
                    else
                    {
                        jsScript = [jsScript.slice(0, jsScript.indexOf(place)), '\''+token.image+'\'', jsScript.slice(jsScript.indexOf(place))].join('');
                    
                    }
                    break;
                
                case "Piece":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'new piece() ', jsScript.slice(jsScript.indexOf(place))].join('');
                    break;
                default:
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image + ' ', jsScript.slice(jsScript.indexOf(place))].join('');
                    break;

            }

            
                
        
        }
       
        if(node.name == "MethodCall")
        {
            
            visitMethodCall(node, place)
        }
        else if(node.name == "Object")
        {
            //we take in an array of objects so write the square brackets
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), '[', jsScript.slice(jsScript.indexOf(place))].join('');

            visitObject(node, place)
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), ']', jsScript.slice(jsScript.indexOf(place))].join('');

        }
        else if(node.name == "ForLoopStep")
        {
            visitForLoopStep(node,place);
        }
        else{
            visitPlayerStatements(node,place);
        }
    }
}
function visitForLoopStep(cstOutput:CstNode, place:string)
{
    
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        if(node.name)
            visitForLoopStep(node,place);

        if(token.tokenType)
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image + '', jsScript.slice(jsScript.indexOf(place))].join('');
                    
        }
    }
}


function visitObject(cstOutput:CstNode, place:string)
{
    
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;

        if(token.tokenType)
        {
            if(token.tokenType.name == "OpenSquareBracket")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf(place)), '{', jsScript.slice(jsScript.indexOf(place))].join('');

            }
            else if(token.tokenType.name == "CloseSquareBracket")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf(place)), '}', jsScript.slice(jsScript.indexOf(place))].join('');

            }
            else
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf(place)), ' '+token.image, jsScript.slice(jsScript.indexOf(place))].join('');

            }
        }
        if(node.name)
        {
            visitObject(node, place)
        }
    }
}
function visitMethodCall(cstOutput:CstNode, place:string)
{
    
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;

        if(node.name)
        {
            switch(node.name)
            {
                case "rGetTileByID":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'await this.State.', jsScript.slice(jsScript.indexOf(place))].join('');
     
                    visitGetTileByID(node, place)
                    break;
                case "rGetTilesByType":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'await this.State.', jsScript.slice(jsScript.indexOf(place))].join('');
     
                    visitGetTilesByType(node,place)
                    break;
                case "SpecialMethods":
                    visitMethodCall(node,place)
                    break;
                case "rAddPieceToTile":
                    visitRAddPieceToTile(node, place)
                    break;
                case "rAddToArr":
                    visitRAddToArre(node, place)
                    break;
                case "rGenerateChoices":
                    visitGenerateChoices(node, place)
                    break;
                case "rChooseAction":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)),'await this.', jsScript.slice(jsScript.indexOf(place))].join('');
                    visitRChooseAction(node, place)
                    break;
                case "rIsActionLegal":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)),'await this.', jsScript.slice(jsScript.indexOf(place))].join('');
                    visitRIsActionLegal(node, place)
                    break;
                case "rCopy":
                    visitRCopy(node, place)
                    break;
                case "rCreateBoard":
                        visitRCreateBoard(node, place)
                        break;
                case "rCreateCard":
                    visitRCreateCard(node, place)
                        break;  
                case "rGetBoard":
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)),'this.State.board', jsScript.slice(jsScript.indexOf(place))].join('');
                    break;
                case "rToInt":
                    visitRToInt(node, place)
                    break;
            }
        }
    }
}

function visitRToInt(cstOutput:CstNode, place:string)
{
    
    
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const token = child[0] as unknown as IToken;
        const node = child[0] as unknown as CstNode;
        if(token.tokenType)
        {
            //
            if(token.tokenType.name == "toInt")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf(place)),'+', jsScript.slice(jsScript.indexOf(place))].join('');
            }
            else
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf(place)),token.image +' ', jsScript.slice(jsScript.indexOf(place))].join('');
            }
        }
        if(node.name)
        {
            
            visitPlayerStatements(node, place);
        }
    }
}
function visitRCreateCard(cstOutput:CstNode, place:string)
{
    
    
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const token = child[0] as unknown as IToken;
        const node = child[0] as unknown as CstNode;

        if(token.image)
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image+' ', jsScript.slice(jsScript.indexOf(place))].join('');
        
        }
        if(node.name)
        {
            visitRCreateCard(node, place);
        }

    }
    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), '\n', jsScript.slice(jsScript.indexOf(place))].join('');
        
}
function visitRCreateBoard(cstOutput:CstNode, place:string)
{
    
    let i = 0;
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const token = child[0] as unknown as IToken;
        const node = child[0] as unknown as CstNode;

        
        if(node.name)
        {
            if(node.name == "Const")
            {
                if(i == 0)
                {
                    i++;
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'for(let i=1;i<=', jsScript.slice(jsScript.indexOf(place))].join('');
                    visitPlayerStatements(node, place);
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), ';i++){\n', jsScript.slice(jsScript.indexOf(place))].join('');
        
                }
                else
                {
                    i++;
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'for(let j=1;j<=', jsScript.slice(jsScript.indexOf(place))].join('');
                    visitPlayerStatements(node, place);
                    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), ';j++){\nthis.Board[i-1][j-1]=new tile()\nthis.Board[i-1][j-1].Id =i+\'-\'+j\n}', jsScript.slice(jsScript.indexOf(place))].join('');
                
                }
            }
        }

    }
    if(i == 1)
    {
        
        jsScript = [jsScript.slice(0, jsScript.indexOf(place)), 'this.Board[i-1]=new tile()\nthis.Board[i-1].Id =i+\'\'\n}', jsScript.slice(jsScript.indexOf(place))].join('');
        
    }
    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), '}\n', jsScript.slice(jsScript.indexOf(place))].join('');
}   


function visitRCopy(cstOutput:CstNode, place:string)
{
    
    

    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const token = child[0] as unknown as IToken;
        const node = child[0] as unknown as CstNode;
        
    }
}



function visitRIsActionLegal(cstOutput:CstNode, place:string)
{
    
    
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const token = child[0] as unknown as IToken;
        const node = child[0] as unknown as CstNode;

        if(token.tokenType)
        {
           
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image+' ', jsScript.slice(jsScript.indexOf(place))].join('');
        }
        if(node.name)
            visitRIsActionLegal(node, place)
    }
}
function visitRChooseAction(cstOutput:CstNode, place:string)
{
    
    
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const token = child[0] as unknown as IToken;
        const node = child[0] as unknown as CstNode;
        if(token.tokenType)
        {
            
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image+' ', jsScript.slice(jsScript.indexOf(place))].join('');
        }
        if(node.name)
            visitRChooseAction(node, place)
    }
}
function visitGenerateChoices(cstOutput:CstNode, place:string)
{
    
    jsScript = [jsScript.slice(0, jsScript.indexOf(place)),'await this.', jsScript.slice(jsScript.indexOf(place))].join('');
     
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const token = child[0] as unknown as IToken;

        if(token.tokenType)
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image+' ', jsScript.slice(jsScript.indexOf(place))].join('');
     

    }
}



function visitRAddToArre(cstOutput:CstNode, place:string)
{
    let code = ".push(";
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        if(token.tokenType)
        {
            if(token.tokenType.name == "UserDefinedIdentifier")
            {
                code = code+token.image+')\n'
            }
        }
        if(node.name)
        {
            if(node.name == "Value")
            {
                let i: keyof typeof node.children;
                for (i in node.children) {
                    const child = node.children[i];
                    const tokeni = child[0] as unknown as IToken;
                    if(tokeni.tokenType)
                    {
                        if(tokeni.tokenType.name == "UserDefinedIdentifier")
                        {
                            code = tokeni.image+code
                        }
                    }

                }
            }
        }
        }


        

    
    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), code, jsScript.slice(jsScript.indexOf(place))].join('');
     
}
function visitRAddPieceToTile(cstOutput:CstNode, place:string)
{
    
    let code = ".pieces.push(";
    let otherCode = ".Tile="
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        if(token.tokenType)
        {
            if(token.tokenType.name == "UserDefinedIdentifier")
            {
                code = code+token.image+')\n'
                otherCode = token.image+otherCode
            }
        }
        if(node.name)
        {
            if(node.name == "Value")
            {
                let i: keyof typeof node.children;
                for (i in node.children) {
                    const child = node.children[i];
                    const tokeni = child[0] as unknown as IToken;
                    if(tokeni.tokenType)
                    {
                        if(tokeni.tokenType.name == "UserDefinedIdentifier")
                        {
                            code = tokeni.image+code
                            otherCode = otherCode+tokeni.image+'\n'
                        }
                    }

                }
            }
        }
        }


        

    
    jsScript = [jsScript.slice(0, jsScript.indexOf(place)), code+otherCode, jsScript.slice(jsScript.indexOf(place))].join('');
     
}


function visitGetTileByID(cstOutput:CstNode, place:string)
{
            
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        if(token.tokenType)
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image + '', jsScript.slice(jsScript.indexOf(place))].join('');
                    
        }
        if(node.name)
        {
            visitGetTileByID(node, place)
        }

    }
}
function visitGetTilesByType(cstOutput:CstNode, place:string)
{
    
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        const node = child[0] as unknown as CstNode;
        const token = child[0] as unknown as IToken;
        if(token.tokenType)
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)), token.image + ' ', jsScript.slice(jsScript.indexOf(place))].join('');
                    
        }
        if(node.name)
        {
            visitGetTilesByType(node, place)
        }

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
                    case "Endgame":
                        break;
                    case "OpenBrace":
                        break; 
                    case "CloseBrace":
                        break; 
                    case "StringLiteral":
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//end_game")), '"'+token.image+ '"', jsScript.slice(jsScript.indexOf("//end_game"))].join('');
                        break;
                    default:
                        jsScript = [jsScript.slice(0, jsScript.indexOf("//end_game")), token.image+ ' ', jsScript.slice(jsScript.indexOf("//end_game"))].join('');
                }
            }
            if(node.name != "SpecialMethods")
            {
                visitPlayerStatements(node,"//end_game");
            }
            else
            {
                specialVisit(node, "//tiles")
            }
            if(node.name == "statements")
            {
                jsScript = [jsScript.slice(0, jsScript.indexOf("//end_game")), '\n' , jsScript.slice(jsScript.indexOf("//end_game"))].join('');
                      
            }

        }
}


function specialVisit(cstOutput:CstNode, place:string)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        
        const node = child[0] as unknown as CstNode;

        if(node.name)
        {
            switch (node.name)
            {
                case "addTileToBoard":
                    addTile(node, place)
                    break;
                case "addAdj":
                    visitAdj(node, place)
                    break;
            }
        }
    }

}
function addTile(cstOutput:CstNode, place:string)
{
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        
        const token = child[0] as unknown as IToken;

        if(token.tokenType.name == "UserDefinedIdentifier")
        {
            jsScript = [jsScript.slice(0, jsScript.indexOf(place)),'this.board.push('+ token.image + ')\n', jsScript.slice(jsScript.indexOf(place))].join('');
        
        }
    }
}
function visitAdj(cstOutput:CstNode, place:string)
{
    let i = 0;
    let param1 = "";
    let k: keyof typeof cstOutput.children;  // visit all children
    for (k in cstOutput.children) {
        const child = cstOutput.children[k];
        
        const token = child[0] as unknown as IToken;
        if(token.tokenType.name == "UserDefinedIdentifier")
        {
            //
            if( i == 0)
            {
                param1 = token.image;
                i++;
            }
            else
            {
                //we have the second param
                jsScript = [jsScript.slice(0, jsScript.indexOf(place)),token.image+".Adjacencies.push("+param1+")\n"+param1+".Adjacencies.push("+token.image+")", jsScript.slice(jsScript.indexOf(place))].join('');
        
            }
        }

        
    }
}