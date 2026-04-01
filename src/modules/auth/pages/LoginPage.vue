<template>
  <section class="auth-page auth-page--login">
    <div class="auth-shell">
      <div class="auth-hero">
        <p class="auth-hero__eyebrow">OrderFlow Workspace</p>
        <h1>Menaxho operacionet nga nje panel i vetem.</h1>
        <p class="auth-hero__text">
          Hyr ne sistem dhe kontrollo klientet, porosite dhe komunikimet ne nje rrjedhe me te qarte pune.
        </p>
      </div>

      <div class="auth-panel">
        <AuthForm mode="login" />
        <p class="auth-switch">
          Nuk ke llogari? <RouterLink to="/register">Krijo account</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AuthForm from '../components/AuthForm.vue';
</script>
