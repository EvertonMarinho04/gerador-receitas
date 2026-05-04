<template>
  <article class="card" :style="{ '--delay': delay + 'ms' }">
    <div class="card-header">
      <div class="card-badge" :class="dificuldadeClass">{{ receita.dificuldade }}</div>
      <h2 class="card-title">{{ receita.nome }}</h2>
      <div class="card-meta">
        <span class="meta-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ receita.tempo }}
        </span>
      </div>
    </div>

    <div class="card-body">
      <section class="section">
        <h3 class="section-title">
          <span class="section-icon">🥕</span> Ingredientes
        </h3>
        <ul class="ingredientes-list">
          <li v-for="(ing, i) in receita.ingredientes" :key="i" class="ingrediente-item">
            <span class="dot"></span>
            {{ ing }}
          </li>
        </ul>
      </section>

      <section class="section">
        <h3 class="section-title">
          <span class="section-icon">👨‍🍳</span> Modo de Preparo
        </h3>
        <ol class="preparo-list">
          <li v-for="(passo, i) in receita.preparo" :key="i" class="preparo-item">
            <span class="step-number">{{ i + 1 }}</span>
            <span class="step-text">{{ limparPasso(passo) }}</span>
          </li>
        </ol>
      </section>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  receita: { type: Object, required: true },
  delay: { type: Number, default: 0 },
});

const dificuldadeClass = {
  "badge-facil": props.receita.dificuldade?.toLowerCase().includes("fácil") || props.receita.dificuldade?.toLowerCase().includes("facil"),
  "badge-medio": props.receita.dificuldade?.toLowerCase().includes("médio") || props.receita.dificuldade?.toLowerCase().includes("medio"),
  "badge-dificil": props.receita.dificuldade?.toLowerCase().includes("difícil") || props.receita.dificuldade?.toLowerCase().includes("dificil"),
};

function limparPasso(passo) {
  // Remove prefixos como "Passo 1:", "1.", "1)" caso a IA os inclua
  return passo.replace(/^(passo\s*\d+\s*[:.-]?\s*|\d+\s*[.):]\s*)/i, "").trim();
}
</script>

<style scoped>
.card {
  background: var(--warm-white);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  animation: cardIn 0.6s ease both;
  animation-delay: var(--delay);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-warm);
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  background: linear-gradient(135deg, var(--terracotta) 0%, var(--terracotta-dark) 100%);
  padding: 28px 28px 24px;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: "";
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
}

.card-header::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 40px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
}

.card-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 12px;
  background: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
}

.badge-facil { background: rgba(60, 180, 80, 0.25); }
.badge-medio { background: rgba(255, 180, 50, 0.25); }
.badge-dificil { background: rgba(255, 80, 80, 0.2); }

.card-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(1.3rem, 2.5vw, 1.65rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.25;
  margin-bottom: 14px;
  position: relative;
  z-index: 1;
}

.card-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  font-weight: 400;
}

.card-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section-title {
  font-family: "DM Sans", sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 16px;
}

.ingredientes-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ingrediente-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--charcoal-mid);
  background: var(--cream);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--border);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--terracotta);
  flex-shrink: 0;
}

.preparo-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.preparo-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--terracotta), var(--terracotta-dark));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.step-text {
  font-size: 14.5px;
  line-height: 1.65;
  color: var(--charcoal-mid);
}
</style>
