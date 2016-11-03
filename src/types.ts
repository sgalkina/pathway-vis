/*
  Custom types
 */

export interface Map {
    map?: Object;
    config?: Object;
    organism?: string;
    model?: Object;
    reactionData?: Object;
    geneData?: Object;
    metaboliteData?: Object;
}

export interface Shared {
    loading?: number;
    map: Map;
}
