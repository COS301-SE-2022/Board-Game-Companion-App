export interface attribute{
    name: string;
    type: string;
    initialValue: string;
    startLine: number;
    endLine: number;
    startPosition: number;
    endPosition: number;
}

export interface entity{
    type: string;
    name: string;
    startLine: number;
    endLine: number;
    startPosition: number;
    endPosition: number;
    properties: attribute[];
    children: entity[];

}

export const emptyEntity:entity = {
    type: "",
    name: "",
    startLine: 0,
    endLine: 0,
    startPosition: 0,
    endPosition: 0,
    properties: [],
    children: []
}