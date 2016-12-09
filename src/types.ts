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
    growthRate?: number;
    removedReactions?: string[];
}

export interface Shared {
    loading?: number;
    map: Map;
    sections?: any;
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
export interface Sample extends APIitem {
	organism: string;
}
export interface Experiment extends APIitem {}

export interface Action {
    type: string;
    label: string;
    callback: any;
    canDisplay: any;
}
