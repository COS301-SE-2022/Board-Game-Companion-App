export interface error{
    offset: number;
    line: number;
    column: number;
    length: number;
    message: string;
}

export interface lexerResult{
    success:boolean;
    errors: error[];
}