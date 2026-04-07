<template>
  <section class="auth-page auth-page--register">
    <div class="auth-shell auth-shell--register">
      <div class="auth-hero auth-hero--register">
        <div class="auth-hero__brand">
          <img class="auth-hero__logo" src="/image1.png" alt="OrderFlow brand" />
          <div>
            <p class="auth-hero__eyebrow">Create Your Workspace</p>
            <p class="auth-hero__brand-subtitle">Platforme per menaxhim operacional</p>
          </div>
        </div>

        <div class="auth-hero__copy">
          <h1>
            <span class="auth-hero__title-accent">Hape workspace-in tend</span>
            <span class="auth-hero__title-dark">ne pak hapa.</span>
          </h1>
          <p class="auth-hero__text">
            Krijo llogarine dhe pergatit nje ambient pune te organizuar per klientet, porosite dhe
            komunikimin ditor te ekipit.
          </p>
        </div>

        <div class="auth-hero__highlights">
          <div class="auth-highlight">
            <strong>Konfigurim i shpejte</strong>
            <span>Fillo me nje hyrje te qarte dhe strukturo biznesin ne pak minuta.</span>
          </div>
          <div class="auth-highlight">
            <strong>Proces i unifikuar</strong>
            <span>Menaxho operacionet kryesore nga nje panel i vetem pune.</span>
          </div>
          <div class="auth-highlight">
            <strong>Gati per ekipin</strong>
            <span>Nje ambient profesional qe mbeshtet koordinim dhe qartesi operative.</span>
          </div>
        </div>
      </div>

      <div class="auth-panel">
        <AuthForm mode="register" />
        <p class="auth-switch">
          Ke llogari ekzistuese? <RouterLink to="/login">Kyqu ketu</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AuthForm from '../components/AuthForm.vue';
</script>

<style scoped>
.auth-shell--register {
  width: min(1180px, 100%);
  grid-template-columns: minmax(380px, 1.08fr) minmax(360px, 430px);
  align-items: start;
  gap: clamp(2rem, 4vw, 5.5rem);
  padding-top: clamp(1rem, 3vw, 2.5rem);
}

.auth-hero--register {
  max-width: 620px;
  gap: 1.4rem;
}

.auth-hero--register h1 {
  max-width: 12ch;
  font-size: clamp(2.55rem, 5vw, 4.15rem);
  line-height: 0.98;
}

.auth-hero--register h1 span {
  display: block;
}

.auth-hero__title-accent {
  color: #38bdf8;
  background: linear-gradient(135deg, #7dd3fc 0%, #38bdf8 35%, #2563eb 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 26px rgba(37, 99, 235, 0.16);
}

.auth-hero__title-dark {
  color: #f59e0b;
  background: linear-gradient(135deg, #0f2c88 0%, #253469 45%, #151068 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 26px rgba(249, 115, 22, 0.14);
}

.auth-hero__brand {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.auth-hero__logo {
  width: 220px;
  height: 140px;
  padding: 0;
  border-radius: 0;
  object-fit: contain;
  filter: drop-shadow(0 14px 30px rgba(14, 165, 233, 0.22));
}

.auth-hero__brand-subtitle {
  margin: 0.2rem 0 0;
  color: rgba(226, 232, 240, 0.72);
  font-size: 0.92rem;
}

.auth-hero__copy {
  display: grid;
  gap: 1rem;
}

.auth-hero__highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.auth-highlight {
  display: grid;
  gap: 0.3rem;
  min-height: 100%;
  padding: 0.95rem 1rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.34);
  box-shadow: 0 18px 36px rgba(2, 6, 23, 0.14);
}

.auth-highlight strong {
  color: #f8fafc;
  font-size: 0.95rem;
  font-weight: 600;
}

.auth-highlight span {
  color: #94a3b8;
  font-size: 0.88rem;
  line-height: 1.5;
}

@media (max-width: 980px) {
  .auth-shell--register {
    width: min(980px, 100%);
    grid-template-columns: 1fr;
    padding-top: 0.5rem;
  }

  .auth-hero--register {
    max-width: none;
  }

  .auth-hero--register h1 {
    max-width: 11ch;
    font-size: clamp(2.3rem, 8vw, 3.6rem);
  }

  .auth-hero__highlights {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-hero__brand {
    gap: 1rem;
  }

  .auth-hero__logo {
    width: 168px;
    height: 108px;
  }

  .auth-highlight {
    padding: 0.85rem 0.9rem;
  }

  .auth-hero--register h1 {
    max-width: 9ch;
  }
}
</style>
