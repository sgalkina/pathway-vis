/*
  Custom types
 */

export interface Map {
    map?: Object;
    settings?: Object;
    model?: Model;
    reactionData?: Object;
    geneData?: Object;
    metaboliteData?: Object;
}

export interface Shared {
    loading?: number;
    map: Map;
}

export interface Model {
    data: Object;
    id: string;
}

interface APIitem {
    id: number;
    name: string;
}

export interface Phase extends APIitem {}
export interface Sample extends APIitem {}
export interface Experiment extends APIitem {}

export interface Action {
    label: string;
    callback: any;
    canDisplay: any;
}
