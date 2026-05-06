import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

// =============================================
// COLOQUE SUA CHAVE DE API AQUI
// Você pode usar OpenAI ou qualquer provedor compatível
// =============================================
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
;

app.use(cors());
app.use(express.json());

app.post("/receitas", async (req, res) => {
  const { ingredientes } = req.body;

  if (!ingredientes || ingredientes.trim() === "") {
    return res.status(400).json({ erro: "Informe ao menos um ingrediente." });
  }

  const prompt = `Você é um chef criativo. Com base nos seguintes ingredientes: "${ingredientes}", crie exatamente 3 receitas diferentes.

Responda APENAS com um array JSON válido, sem nenhum texto adicional, sem markdown, sem blocos de código. Somente o JSON puro.

O formato deve ser exatamente este:
[
  {
    "nome": "Nome da receita",
    "tempo": "XX minutos",
    "dificuldade": "Fácil | Médio | Difícil",
    "ingredientes": ["ingrediente 1", "ingrediente 2"],
    "preparo": ["Passo 1: ...", "Passo 2: ...", "Passo 3: ..."]
  }
]

Regras:
- Crie exatamente 3 receitas
- O preparo deve ter pelo menos 4 passos detalhados
- Use ingredientes extras comuns que possam complementar os fornecidos
- Varie a dificuldade entre as receitas`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const erro = await response.json();
      console.error("Erro da API OpenAI:", erro);
      return res.status(502).json({
        erro: "Erro ao comunicar com a IA. Verifique sua chave de API.",
        detalhe: erro.error?.message || "Erro desconhecido",
      });
    }

    const data = await response.json();
    const conteudo = data.choices?.[0]?.message?.content?.trim();

    if (!conteudo) {
      return res.status(502).json({ erro: "A IA não retornou conteúdo." });
    }

    // Tenta parsear o JSON retornado pela IA
    let receitas;
    try {
      // Remove possíveis blocos de código markdown caso a IA os inclua
      const jsonLimpo = conteudo.replace(/```json|```/g, "").trim();
      receitas = JSON.parse(jsonLimpo);
    } catch (e) {
      console.error("Erro ao parsear JSON da IA:", conteudo);
      return res.status(502).json({
        erro: "A IA retornou um formato inválido. Tente novamente.",
      });
    }

    // Valida a estrutura mínima
    if (!Array.isArray(receitas) || receitas.length === 0) {
      return res.status(502).json({
        erro: "Formato de resposta inválido da IA.",
      });
    }

    return res.json({ receitas });
  } catch (err) {
    console.error("Erro interno:", err);
    return res.status(500).json({
      erro: "Erro interno no servidor. Verifique o console.",
    });
  }
});


const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🍳 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Rota disponível: POST http://localhost:${PORT}/receitas\n`);
});


