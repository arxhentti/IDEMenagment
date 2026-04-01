<template>
  <section class="auth-page auth-page--register">
    <div class="auth-shell">
      <div class="auth-hero">
        <p class="auth-hero__eyebrow">Create Your Workspace</p>
        <h1>Fillo me nje hyrje te organizuar per ekipin tend.</h1>
        <p class="auth-hero__text">
          Krijo llogarine dhe pergatit ambientin ku do te menaxhosh klientet, porosite dhe komunikimet.
        </p>
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
