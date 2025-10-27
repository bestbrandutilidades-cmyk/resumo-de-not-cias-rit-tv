export interface Article {
  titulo: string;
  url: string;
  resumo: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  articles: Article[];
  sources: GroundingChunk[];
}