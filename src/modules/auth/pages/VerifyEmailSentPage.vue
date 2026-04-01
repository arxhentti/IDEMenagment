<template>
  <section class="auth-page">
    <div class="auth-shell auth-shell--single">
      <div class="auth-panel">
        <div class="verify-card">
          <p class="eyebrow">Check Your Inbox</p>
          <h1>Email verification</h1>
          <p class="muted">
            We sent a verification link to your email. If you did not receive it, you can request another one below.
          </p>

          <label class="verify-field">
            <span>Email</span>
            <input v-model="email" class="input" type="email" placeholder="your@email.com" />
          </label>

          <p v-if="successMessage" class="verify-success">{{ successMessage }}</p>
          <p v-if="errorMessage" class="verify-error">{{ errorMessage }}</p>

          <div class="verify-actions">
            <button class="btn" type="button" :disabled="loading" @click="handleResend">
              {{ loading ? 'Sending...' : 'Resend verification' }}
            </button>
            <RouterLink class="verify-link" to="/login">Go to login</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { authService } from '../../../services/auth.service';

const route = useRoute();
const email = ref(typeof route.query.email === 'string' ? route.query.email : '');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

async function handleResend() {
  if (!email.value.trim()) {
    errorMessage.value = 'Email is required.';
    successMessage.value = '';
    return;
  }

  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await authService.resendVerification(email.value.trim());
    successMessage.value = 'Verification email was sent successfully.';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.title || 'Resend failed.';
    } else {
      errorMessage.value = 'Resend failed.';
    }
  } finally {
    loading.value = false;
  }
}
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

.verify-field {
  display: grid;
  gap: 0.45rem;
}

.verify-field span {
  color: #cbd5e1;
  font-size: 0.84rem;
  font-weight: 500;
}

.verify-error,
.verify-success {
  padding: 0.85rem 1rem;
  border-radius: 0.9rem;
}

.verify-error {
  border: 1px solid rgba(248, 113, 113, 0.35);
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
}

.verify-success {
  border: 1px solid rgba(34, 197, 94, 0.28);
  background: rgba(20, 83, 45, 0.35);
  color: #bbf7d0;
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
