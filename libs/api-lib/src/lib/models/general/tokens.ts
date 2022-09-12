import * as chevrotain from 'chevrotain';

export const tUserDefinedIdentifier = chevrotain.createToken({name:"UserDefinedIdentifier",pattern:/[a-zA-Z_]+[a-zA-Z0-9]*/});

// class and function declaration
export const tAction =(chevrotain.createToken({name:"Action",pattern:/action/,longer_alt:tUserDefinedIdentifier}));
export const tParameters =(chevrotain.createToken({name:"Parameters",pattern:/parameters/,longer_alt:tUserDefinedIdentifier}));
export const tCondition=(chevrotain.createToken({name:"Condition",pattern:/condition/,longer_alt:tUserDefinedIdentifier}));
export const tEffect=(chevrotain.createToken({name:"Effect",pattern:/effect/,longer_alt:tUserDefinedIdentifier}));
export const tState=(chevrotain.createToken({name:"State",pattern:/state/,longer_alt:tUserDefinedIdentifier}));
export const tTurn=(chevrotain.createToken({name:"Turn",pattern:/turn/,longer_alt:tUserDefinedIdentifier}));
export const tPlayer=(chevrotain.createToken({name:"Player",pattern:/player/,longer_alt:tUserDefinedIdentifier}));
export const tCards=(chevrotain.createToken({name:"Card",pattern:/card/,longer_alt:tUserDefinedIdentifier}));

export const tTile=(chevrotain.createToken({name:"Tile",pattern:/tile/,longer_alt:tUserDefinedIdentifier}));
export const tCreateCard=(chevrotain.createToken({name:"CreateCard",pattern:/createCard/,longer_alt:tUserDefinedIdentifier}));

export const tPiece=(chevrotain.createToken({name:"Piece",pattern:/piece/,longer_alt:tUserDefinedIdentifier}));
export const tAddToArr=(chevrotain.createToken({name:"addToArr",pattern:/addToArr/,longer_alt:tUserDefinedIdentifier}));
export const tConsider=(chevrotain.createToken({name:"consider",pattern:/consider/,longer_alt:tUserDefinedIdentifier}));
export const tCopy=(chevrotain.createToken({name:"copy",pattern:/copy/,longer_alt:tUserDefinedIdentifier}));

export const tCreateBoard=(chevrotain.createToken({name:"CreateBoard",pattern:/createBoard/,longer_alt:tUserDefinedIdentifier}));


export const tAddToBoard =(chevrotain.createToken({name:"AddToBoard",pattern:/addToBoard/,longer_alt:tUserDefinedIdentifier}));
export const tAddAdjacency =(chevrotain.createToken({name:"AddAdjacency",pattern:/addAdjacency/,longer_alt:tUserDefinedIdentifier}));
export const tAddPieceToTile =(chevrotain.createToken({name:"addPieceToTile",pattern:/addPieceToTile/,longer_alt:tUserDefinedIdentifier}));

export const tGetBoard =(chevrotain.createToken({name:"getBoard",pattern:/getBoard/,longer_alt:tUserDefinedIdentifier}));
export const tTileAttributes =(chevrotain.createToken({name:"tileAttribute",pattern:/tileAttribute/,longer_alt:tUserDefinedIdentifier}));

export const tGetTileByID =(chevrotain.createToken({name:"getTileByID",pattern:/getTileByID/,longer_alt:tUserDefinedIdentifier}));
export const tGetTilesByType =(chevrotain.createToken({name:"getTilesByType",pattern:/getTilesByType/,longer_alt:tUserDefinedIdentifier}));
export const tGenerateChoices =(chevrotain.createToken({name:"generateChoices",pattern:/generateChoices/,longer_alt:tUserDefinedIdentifier}));
export const tChooseAction =(chevrotain.createToken({name:"chooseAction",pattern:/chooseAction/,longer_alt:tUserDefinedIdentifier}));
export const tIsActionLegal =(chevrotain.createToken({name:"isActionLegal",pattern:/isActionLegal/,longer_alt:tUserDefinedIdentifier}));


export const tEndgame=(chevrotain.createToken({name:"Endgame",pattern:/endgame/,longer_alt:tUserDefinedIdentifier}));
export const tReturn=(chevrotain.createToken({name:"Return",pattern:/return/,longer_alt:tUserDefinedIdentifier}));

//punctuation
export const tComma=(chevrotain.createToken({name:"Comma",pattern:/,/}));
export const tOpenBracket=(chevrotain.createToken({name:"OpenBracket",pattern:/\(/ }));
export const tCloseBracket=(chevrotain.createToken({name:"CloseBracket",pattern:/\)/}));
export const tOpenBrace=(chevrotain.createToken({name:"OpenBrace",pattern:/{/}));
export const tCloseBrace=(chevrotain.createToken({name:"CloseBrace",pattern:/}/}));
export const tColon=(chevrotain.createToken({name:"Colon",pattern:/:/}));
export const tOpenSquareBracket=(chevrotain.createToken({name:"OpenSquareBracket",pattern:/\[/}));
export const tClosedSquareBracket=(chevrotain.createToken({name:"ClosedSquareBracket",pattern:/\]/}));
export const tQuestionMark=(chevrotain.createToken({name:"QuestionMark",pattern:/\?/}));
export const tSemiColon=(chevrotain.createToken({name:"SemiColon",pattern:/;/}));
export const tDot = chevrotain.createToken({name:"Dot",pattern:/\./})

//relational operators
export const tGreaterThanOrEqual = chevrotain.createToken({name:"GreaterThanOrEqual",pattern:/>=/});
export const tLessThanOrEqual = chevrotain.createToken({name:"LessThanOrEqual",pattern:/<=/});
export const tEqual = chevrotain.createToken({name:"Equal",pattern:/==/});
export const tNotEqual = chevrotain.createToken({name:"NotEqual",pattern:/!=/});
export const tGreaterThan=(chevrotain.createToken({name:"GreaterThan",pattern:/>/,longer_alt:tGreaterThanOrEqual}));
export const tLessThan=(chevrotain.createToken({name:"LessThan",pattern:/</,longer_alt:tLessThanOrEqual}));

//Assignment operators
export const tAssign=(chevrotain.createToken({name:"Assign",pattern:/=/,longer_alt:tEqual}));

//literals
export const tFloatLiteral = chevrotain.createToken({name:"FloatLiteral",pattern:/-?([1-9]+[0-9]*\.?[0-9]*|0?\.[0-9]+)/});


export const tIntegerLiteral=(chevrotain.createToken({name:"IntegerLiteral",pattern:/0|-?[1-9][1-9]*/,longer_alt:tFloatLiteral}));
export const tStringLiteral=(chevrotain.createToken({name:"StringLiteral",pattern:/("[A-Za-z0-9 ]*")|('[A-Za-z0-9 ]*')/ }));
export const tFalse=(chevrotain.createToken({name:"False",pattern:/false/,longer_alt:tUserDefinedIdentifier}));
export const tTrue=(chevrotain.createToken({name:"True",pattern:/true/,longer_alt:tUserDefinedIdentifier}));



//arithmetic operators


export const tPlus=(chevrotain.createToken({name:"Plus",pattern:/\+/}));
export const tMinus=(chevrotain.createToken({name:"Minus",pattern:/-/,longer_alt:tIntegerLiteral}));
export const tMultiply=(chevrotain.createToken({name:"Multiply",pattern:/\*/}));
export const tDivide=(chevrotain.createToken({name:"Divide",pattern:/\\/}));
export const tMod=(chevrotain.createToken({name:"Mod",pattern:/%/,longer_alt:tUserDefinedIdentifier}));




//logical operators
export const tAnd=(chevrotain.createToken({name:"And",pattern:/&&/,longer_alt:tUserDefinedIdentifier}));
export const tOr=(chevrotain.createToken({name:"Or",pattern:/\|\|/,longer_alt:tUserDefinedIdentifier}));
export const tNot=(chevrotain.createToken({name:"Not",pattern:/!/,longer_alt:tNotEqual}));



//input output

export const tInputGroup=(chevrotain.createToken({name:"InputGroup",pattern:/inputGroup/,longer_alt:tUserDefinedIdentifier}));
export const tInput=(chevrotain.createToken({name:"Input",pattern:/input/,longer_alt:tInputGroup}));
export const tPrint=(chevrotain.createToken({name:"Print",pattern:/output/,longer_alt:tUserDefinedIdentifier}));
export const tRead=(chevrotain.createToken({name:"Read",pattern:/read/,longer_alt:tUserDefinedIdentifier}));





//loops
export const tWhile=(chevrotain.createToken({name:"While",pattern:/while/,longer_alt:tUserDefinedIdentifier}));
export const tFor=(chevrotain.createToken({name:"For",pattern:/for/,longer_alt:tUserDefinedIdentifier}));
export const tDo=(chevrotain.createToken({name:"do",pattern:/do/,longer_alt:tUserDefinedIdentifier}));

//branch
export const tIf=(chevrotain.createToken({name:"If",pattern:/if/,longer_alt:tUserDefinedIdentifier}));
export const tElse=(chevrotain.createToken({name:"Else",pattern:/else/,longer_alt:tUserDefinedIdentifier}));

//flow control
export const tBreak=(chevrotain.createToken({name:"Break",pattern:/break/,longer_alt:tUserDefinedIdentifier}));
export const tContinue=(chevrotain.createToken({name:"Continue",pattern:/continue/,longer_alt:tUserDefinedIdentifier}));

//presets
export const tMinmax=(chevrotain.createToken({name:"Minmax",pattern:/minmax/,longer_alt:tUserDefinedIdentifier}));
export const tNeuralNetwork=(chevrotain.createToken({name:"NeuralNetwork",pattern:/model/,longer_alt:tUserDefinedIdentifier}));

//variable
export const tVariable=(chevrotain.createToken({name:"Variable",pattern:/var/,longer_alt:tUserDefinedIdentifier}));
export const tLet=(chevrotain.createToken({name:"Let",pattern:/let/,longer_alt:tUserDefinedIdentifier}));

//whitespace
export const tWhiteSpace=(chevrotain.createToken({name:"WhiteSpace",pattern:/\s+/,group: chevrotain.Lexer.SKIPPED}));

//comments
export const tComent=(chevrotain.createToken({name:"WhiteSpace",pattern:/\/\*[a-zA-Z0-9]*\*\//,group: chevrotain.Lexer.SKIPPED}));





 export const AllTokens:chevrotain.TokenType[] = [
    tStringLiteral,
    tAction,
    tParameters,
    tCondition,
    tEffect,
    tState,
    tTurn,
    tPlayer,
    tCards,
    tTile,
    tCreateCard,
    tCreateBoard,
    tPiece,
    tAddToArr,
    tAddToBoard,
    tConsider,
    tCopy,
    tAddAdjacency,
    tAddPieceToTile,
    tGetBoard,
    tGetTileByID,
    tGetTilesByType,
    tGenerateChoices,
    tChooseAction,
    tIsActionLegal,
    tEndgame,
    tReturn,
    tComma,
    tOpenBracket,
    tCloseBracket,
    tOpenBrace,
    tCloseBrace,
    tColon,
    tOpenSquareBracket,
    tClosedSquareBracket,
    tQuestionMark,
    tSemiColon,
    tDot,
    tLessThanOrEqual,
    tGreaterThanOrEqual,
    tEqual,
    tNotEqual,
    tGreaterThan,
    tLessThan,
    tAssign,
    
    tPlus,
    tMinus,
    tMultiply,
    tDivide,
    tMod,
    tAnd,
    tOr,
    tNot,
    tFloatLiteral,
    tIntegerLiteral,
    
    tFalse,
    tTrue,
    tInputGroup,

    tInput,
    tPrint,
    tRead,
    tWhile,
    tFor,
    tDo,
    tIf,
    tElse,
    tBreak,


    tContinue,
    tMinmax,
    tNeuralNetwork,
    tVariable,
    tLet,
    tWhiteSpace,
    tComent,
    tUserDefinedIdentifier,
];