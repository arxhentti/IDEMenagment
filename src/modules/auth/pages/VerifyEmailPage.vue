<template>
  <section class="auth-page">
    <div class="auth-shell auth-shell--single">
      <div class="auth-panel">
        <div class="verify-card">
          <p class="eyebrow">Email Verification</p>
          <h1>Verify your email</h1>
          <p class="muted">
            {{ statusMessage }}
          </p>

          <p v-if="errorMessage" class="verify-error">{{ errorMessage }}</p>

          <div class="verify-actions">
            <RouterLink class="verify-link" to="/login">Go to login</RouterLink>
            <RouterLink class="verify-link" to="/verify-email-sent">Resend email</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { authService } from '../../../services/auth.service';

const route = useRoute();
const isLoading = ref(true);
const isSuccess = ref(false);
const errorMessage = ref('');

const statusMessage = computed(() => {
  if (isLoading.value) {
    return 'We are validating your verification link.';
  }

  if (isSuccess.value) {
    return 'Your email has been verified successfully. You can now log in.';
  }

  return 'The verification link could not be completed automatically.';
});

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : '';

  if (!token) {
    isLoading.value = false;
    errorMessage.value = 'Verification token is missing.';
    return;
  }

  try {
    await authService.verifyEmail(token);
    isSuccess.value = true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.title || 'Verification failed.';
    } else {
      errorMessage.value = 'Verification failed.';
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.auth-shell--single {
  grid-template-columns: minmax(0, 520px);
}

.verify-card {
  display: grid;
  gap: 1rem;
}

.verify-card h1,
.verify-card p {
  margin: 0;
}

.verify-error {
  padding: 0.85rem 1rem;
  border: 1px solid rgba(248, 113, 113, 0.35);
  border-radius: 0.9rem;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
}

.verify-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.verify-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.75rem 0.95rem;
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: rgba(15, 23, 42, 0.42);
}
</style>
