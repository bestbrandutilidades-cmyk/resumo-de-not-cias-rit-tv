import { GoogleGenAI } from "@google/genai";
import type { SearchResult, Article, GroundingChunk } from '../types';

const API_KEY = process.env.API_KEY;

// Inicializa o cliente da IA apenas se a chave da API existir.
// Isso impede que o aplicativo trave na inicialização.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const fetchNews = async (topic: string): Promise<SearchResult> => {
  // Se o cliente da IA não foi inicializado (sem chave), lança um erro amigável.
  if (!ai) {
    throw new Error("A chave da API do Google não foi configurada. Adicione a variável de ambiente API_KEY nas configurações do seu projeto na Vercel e faça o 'Redeploy'.");
  }

  try {
    const prompt = `Pesquise as 5 notícias mais recentes e relevantes sobre "${topic}" do Brasil e do mundo.
Formate a resposta EXCLUSIVAMENTE como um array JSON dentro de um bloco de código markdown \`\`\`json.
Cada objeto no array deve ter as chaves "titulo", "url", e "resumo".
Para a chave "resumo", crie um resumo um pouco mais detalhado da notícia, com cerca de 3 a 4 frases.
Exemplo de formato:
\`\`\`json
[
  {
    "titulo": "Título da Notícia 1",
    "url": "https://exemplo.com/noticia1",
    "resumo": "Este é um resumo mais longo e detalhado da primeira notícia, explicando os pontos principais em várias sentenças para dar mais contexto ao leitor."
  }
]
\`\`\`
Não adicione nenhum texto ou explicação fora do bloco de código JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    let jsonText = '';

    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);

    if (match && match[1]) {
      jsonText = match[1].trim();
    } else {
      // Fallback: if no markdown block, assume the whole text might be JSON
      jsonText = text.trim();
    }

    try {
      const parsedJson = JSON.parse(jsonText);
      const articles: Article[] = Array.isArray(parsedJson) ? parsedJson : parsedJson.noticias || [];
      
      if (!Array.isArray(articles)) {
          throw new Error("Formato de notícias inválido recebido.");
      }
      
      const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { articles, sources };
    } catch(e) {
      console.error("Falha ao analisar JSON da resposta da IA:", e);
      console.error("Resposta recebida:", text);
      throw new Error("A resposta da IA não pôde ser processada. Tente uma busca diferente.");
    }
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
     if (error instanceof Error && (error.message.includes("IA") || error.message.includes("API"))) {
        throw error;
    }
    throw new Error("Não foi possível obter as notícias. Tente novamente.");
  }
};
