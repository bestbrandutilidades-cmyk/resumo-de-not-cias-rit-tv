
export interface Article {
  titulo: string;
  url: string;
  resumo: string;
}

export interface GroundingChunk {
  web?: {
    // FIX: Made uri and title optional to match the type from @google/genai SDK.
    uri?: string;
    title?: string;
  };
}

export interface SearchResult {
  articles: Article[];
  sources: GroundingChunk[];
}