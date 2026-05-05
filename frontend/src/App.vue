<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo-area">
          <span class="logo-icon">🍳</span>
          <div>
            <h1 class="logo-title">Gerador de Receitas</h1>
            <p class="logo-sub">com Inteligência Artificial</p>
          </div>
        </div>
        <p class="header-desc">
          Diga quais ingredientes você tem em casa e deixe a IA criar receitas deliciosas pra você.
        </p>
      </div>
    </header>

    <!-- Search area -->
    <main class="main">
      <section class="search-section">
        <div class="search-card">
          <label class="search-label" for="ingredientes">
            O que você tem na geladeira?
          </label>
          <p class="search-hint">
            Liste os ingredientes separados por vírgula. Ex: frango, batata, alho, cebola
          </p>
          <div class="input-row">
            <textarea
              id="ingredientes"
              v-model="ingredientes"
              class="input-area"
              placeholder="frango, batata doce, azeite, alecrim..."
              rows="3"
              @keydown.ctrl.enter="gerarReceitas"
              :disabled="carregando"
            ></textarea>
          </div>
          <button
            class="btn-gerar"
            @click="gerarReceitas"
            :disabled="carregando || !ingredientes.trim()"
          >
            <span v-if="!carregando" class="btn-inner">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              Gerar Receitas
            </span>
            <span v-else class="btn-loading">
              <span class="spinner"></span>
              Consultando a IA...
            </span>
          </button>

          <p v-if="!carregando" class="search-tip">
            💡 Dica: pressione <kbd>Ctrl + Enter</kbd> para gerar
          </p>
        </div>
      </section>

      <!-- Loading state -->
      <section v-if="carregando" class="loading-section">
        <div class="loading-card">
          <div class="chef-animation">👨‍🍳</div>
          <p class="loading-text">Criando receitas especiais para você...</p>
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </section>

      <!-- Error state -->
      <section v-if="erro" class="error-section">
        <div class="error-card">
          <span class="error-icon">⚠️</span>
          <div>
            <p class="error-title">Algo deu errado</p>
            <p class="error-msg">{{ erro }}</p>
          </div>
          <button class="btn-retry" @click="gerarReceitas">Tentar novamente</button>
        </div>
      </section>

      <!-- Results -->
      <section v-if="receitas.length > 0 && !carregando" class="results-section">
        <div class="results-header">
          <h2 class="results-title">
            <span class="results-count">{{ receitas.length }}</span>
            receitas criadas para você
          </h2>
          <p class="results-sub">Baseadas em: <em>{{ ingredientesUsados }}</em></p>
        </div>

        <div class="cards-grid">
          <RecipeCard
            v-for="(receita, i) in receitas"
            :key="i"
            :receita="receita"
            :delay="i * 150"
          />
        </div>

        <button class="btn-nova" @click="novaConsulta">
          ↩ Nova consulta
        </button>
      </section>

      <!-- Empty state -->
      <section v-if="!carregando && receitas.length === 0 && !erro" class="empty-section">
        <div class="empty-card">
          <div class="empty-icons">
            <span>🥩</span><span>🥕</span><span>🧅</span><span>🫑</span><span>🍅</span>
          </div>
          <p class="empty-text">
            Informe os ingredientes acima e clique em<br/>
            <strong>Gerar Receitas</strong> para começar!
          </p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>Feito com ❤️ e IA · Gerador de Receitas</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import RecipeCard from "./components/RecipeCard.vue";

const ingredientes = ref("");
const receitas = ref([]);
const carregando = ref(false);
const erro = ref("");
const ingredientesUsados = ref("");

async function gerarReceitas() {
  if (!ingredientes.value.trim() || carregando.value) return;

  erro.value = "";
  receitas.value = [];
  carregando.value = true;
  ingredientesUsados.value = ingredientes.value.trim();

  try {
    const response = await fetch("https://gerador-receitas.onrender.com/receitas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredientes: ingredientes.value.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      erro.value = data.erro || "Erro desconhecido. Tente novamente.";
      if (data.detalhe) erro.value += ` (${data.detalhe})`;
      return;
    }

    if (!data.receitas || data.receitas.length === 0) {
      erro.value = "A IA não retornou receitas. Tente com outros ingredientes.";
      return;
    }

    receitas.value = data.receitas;
  } catch (e) {
    erro.value = "Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 3001.";
    console.error(e);
  } finally {
    carregando.value = false;
  }
}

function novaConsulta() {
  receitas.value = [];
  erro.value = "";
  ingredientesUsados.value = "";
  ingredientes.value = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Header ── */
.header {
  background: linear-gradient(160deg, var(--forest) 0%, #1a2e1a 100%);
  padding: 52px 24px 48px;
  position: relative;
  overflow: hidden;
}

.header::before {
  content: "";
  position: absolute;
  top: -60px;
  right: -60px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 144, 46, 0.15) 0%, transparent 70%);
}

.header-inner {
  max-width: 860px;
  margin: 0 auto;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
}

.logo-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.logo-sub {
  font-size: 13px;
  color: var(--gold-light);
  letter-spacing: 0.06em;
  font-weight: 400;
  margin-top: 3px;
}

.header-desc {
  font-size: 15px;
  color: rgba(255,255,255,0.65);
  line-height: 1.6;
  max-width: 520px;
}

/* ── Main ── */
.main {
  flex: 1;
  padding: 48px 24px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* ── Search ── */
.search-section {
  margin-bottom: 40px;
}

.search-card {
  background: var(--warm-white);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 36px;
  box-shadow: var(--shadow-warm);
}

.search-label {
  display: block;
  font-family: "Playfair Display", serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--charcoal);
  margin-bottom: 8px;
}

.search-hint {
  font-size: 13.5px;
  color: var(--text-muted);
  margin-bottom: 20px;
  line-height: 1.5;
}

.input-row {
  margin-bottom: 20px;
}

.input-area {
  width: 100%;
  padding: 16px 18px;
  font-family: "DM Sans", sans-serif;
  font-size: 15px;
  color: var(--charcoal);
  background: var(--cream);
  border: 2px solid transparent;
  border-radius: 14px;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
  line-height: 1.6;
}

.input-area:focus {
  border-color: var(--terracotta);
  box-shadow: 0 0 0 4px rgba(196, 98, 45, 0.1);
}

.input-area:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-area::placeholder {
  color: var(--text-muted);
}

.btn-gerar {
  width: 100%;
  padding: 16px 28px;
  background: linear-gradient(135deg, var(--terracotta) 0%, var(--terracotta-dark) 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  font-family: "DM Sans", sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(196, 98, 45, 0.35);
}

.btn-gerar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(196, 98, 45, 0.45);
}

.btn-gerar:active:not(:disabled) {
  transform: translateY(0);
}

.btn-gerar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-inner, .btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-tip {
  text-align: center;
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 14px;
}

kbd {
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 6px;
  font-family: monospace;
  font-size: 11px;
}

/* ── Loading ── */
.loading-card {
  text-align: center;
  padding: 48px;
  background: var(--warm-white);
  border-radius: 20px;
  border: 1px solid var(--border);
}

.chef-animation {
  font-size: 64px;
  animation: bounce 1.2s ease-in-out infinite;
  display: block;
  margin-bottom: 20px;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.loading-text {
  font-family: "Playfair Display", serif;
  font-size: 1.1rem;
  color: var(--charcoal-mid);
  margin-bottom: 20px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--terracotta);
  animation: dotPulse 1.2s ease-in-out infinite;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* ── Error ── */
.error-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #fff5f5;
  border: 1px solid rgba(220, 80, 80, 0.2);
  border-radius: 16px;
  padding: 24px;
  flex-wrap: wrap;
}

.error-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.error-title {
  font-weight: 600;
  color: #c0392b;
  margin-bottom: 4px;
}

.error-msg {
  font-size: 14px;
  color: #7f3030;
  flex: 1;
}

.btn-retry {
  margin-left: auto;
  padding: 8px 20px;
  background: var(--terracotta);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-retry:hover {
  background: var(--terracotta-dark);
}

/* ── Results ── */
.results-header {
  margin-bottom: 28px;
}

.results-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(1.3rem, 3vw, 1.7rem);
  font-weight: 700;
  color: var(--charcoal);
  margin-bottom: 6px;
}

.results-count {
  color: var(--terracotta);
}

.results-sub {
  font-size: 14px;
  color: var(--text-muted);
}

.results-sub em {
  color: var(--charcoal-mid);
  font-style: normal;
  font-weight: 500;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.btn-nova {
  display: block;
  margin: 0 auto;
  padding: 12px 32px;
  background: transparent;
  color: var(--terracotta);
  border: 2px solid var(--terracotta);
  border-radius: 12px;
  font-family: "DM Sans", sans-serif;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-nova:hover {
  background: var(--terracotta);
  color: #fff;
}

/* ── Empty ── */
.empty-card {
  text-align: center;
  padding: 60px 24px;
}

.empty-icons {
  font-size: 40px;
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  opacity: 0.7;
}

.empty-text {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.8;
}

.empty-text strong {
  color: var(--terracotta);
}

/* ── Footer ── */
.footer {
  text-align: center;
  padding: 24px;
  font-size: 13px;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .main { padding: 32px 16px; }
  .search-card { padding: 24px 20px; }
  .header { padding: 36px 20px 32px; }
  .logo-area { gap: 12px; }
  .logo-icon { font-size: 36px; }
  .cards-grid { grid-template-columns: 1fr; }
  .error-card { flex-direction: column; }
  .btn-retry { margin-left: 0; }
}
</style>
