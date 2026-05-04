# 🍳 Gerador de Receitas com IA

Site completo para gerar receitas com base nos ingredientes disponíveis, usando IA (OpenAI GPT).

---

## 📁 Estrutura do Projeto

```
gerador-receitas/
├── backend/
│   ├── server.js       ← Servidor Node.js/Express
│   └── package.json
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.js
        ├── style.css
        ├── App.vue
        └── components/
            └── RecipeCard.vue
```

---

## ⚙️ Configuração da API Key

### 1. Obtenha sua chave da OpenAI
Acesse: https://platform.openai.com/api-keys

### 2. Configure no backend

**Opção A — Variável de ambiente (recomendado):**
```bash
# Linux/macOS
export OPENAI_API_KEY="sk-..."
node server.js

# Windows (CMD)
set OPENAI_API_KEY=sk-...
node server.js

# Windows (PowerShell)
$env:OPENAI_API_KEY="sk-..."
node server.js
```

**Opção B — Editar diretamente no código:**

Abra `backend/server.js` e substitua:
```js
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "SUA_CHAVE_AQUI";
```
por:
```js
const OPENAI_API_KEY = "sk-sua-chave-real-aqui";
```

---

## 🚀 Como rodar

### Backend (Terminal 1)
```bash
cd backend
npm install
node server.js
```
> Rodará em: http://localhost:3001

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
> Rodará em: http://localhost:5173

### Acesse no navegador
Abra: **http://localhost:5173**

---

## 🧪 Como testar o backend diretamente

```bash
curl -X POST http://localhost:3001/receitas \
  -H "Content-Type: application/json" \
  -d '{"ingredientes": "frango, batata, alho"}'
```

---

## 🛠️ Tecnologias

| Camada    | Tecnologia                  |
|-----------|-----------------------------|
| Frontend  | Vue 3 + Vite                |
| Backend   | Node.js + Express           |
| IA        | OpenAI GPT-4o-mini          |
| Estilo    | CSS customizado (sem libs)  |

---

## ❗ Solução de problemas

| Problema | Solução |
|----------|---------|
| "Não foi possível conectar ao servidor" | Verifique se o backend está rodando na porta 3001 |
| "Erro ao comunicar com a IA" | Verifique se a OPENAI_API_KEY está correta e tem créditos |
| "Formato inválido" | Tente novamente — às vezes a IA varia a resposta |
| CORS error no browser | Certifique-se de acessar via `localhost:5173` (não abrir o HTML direto) |
