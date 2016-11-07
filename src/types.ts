/*
  Custom types
 */

export interface Map {
    map?: Object;
    settings?: Object;
    model?: Object;
    reactionData?: Object;
    geneData?: Object;
    metaboliteData?: Object;
}

export interface Shared {
    loading?: number;
    map: Map;
}

interface APIitem {
    id: number;
    name: string;
}

export interface Strain extends APIitem {}
export interface Experiment extends APIitem {}
