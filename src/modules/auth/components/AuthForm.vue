<template>
  <div class="auth-card">
    <div class="auth-card__header">
      <p class="auth-card__eyebrow">{{ mode === 'login' ? 'Account Access' : 'Create Account' }}</p>
      <h2>{{ mode === 'login' ? 'Login' : 'Register' }}</h2>
      <p class="auth-card__description">
        {{
          mode === 'login'
            ? 'Hyr ne workspace per te menaxhuar klientet, porosite dhe komunikimet.'
            : 'Krijo nje llogari te re dhe fillo konfigurimin e workspace-it tend.'
        }}
      </p>
    </div>

    <form class="auth-form" @submit.prevent="submit">
      <div v-if="mode === 'register'" class="auth-form__grid">
        <label class="auth-field">
          <span>Full name</span>
          <BaseInput v-model="form.fullName" placeholder="Emri dhe mbiemri" />
        </label>

        <label class="auth-field">
          <span>Business name</span>
          <BaseInput v-model="form.businessName" placeholder="Emri i biznesit" />
        </label>
      </div>

      <label class="auth-field">
        <span>Email</span>
        <BaseInput v-model="form.email" type="email" placeholder="team@company.com" />
      </label>

      <label class="auth-field">
        <span>Password</span>
        <BaseInput v-model="form.password" type="password" placeholder="Shkruaj password-in" />
      </label>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

      <BaseButton class="auth-submit" type="submit" :loading="isSubmitting">
        {{ mode === 'login' ? 'Login' : 'Create account' }}
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import { useAuthStore } from '../../../stores/auth.store';

const props = defineProps<{ mode: 'login' | 'register' }>();

const auth = useAuthStore();
const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  fullName: '',
  businessName: '',
  email: '',
  password: '',
});

function validateForm(): string {
  if (!form.email.trim() || !form.password.trim()) {
    return 'Email dhe password jane te detyrueshme.';
  }

  if (props.mode === 'register' && (!form.fullName.trim() || !form.businessName.trim())) {
    return 'Ploteso edhe full name dhe business name.';
  }

  return '';
}

async function submit() {
  errorMessage.value = validateForm();

  if (errorMessage.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    if (props.mode === 'login') {
      await auth.login({
        email: form.email.trim(),
        password: form.password,
      });
    } else {
      const response = await auth.register({
        fullName: form.fullName.trim(),
        businessName: form.businessName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      await router.push({
        path: '/verify-email-sent',
        query: {
          email: response.email,
        },
      });
      return;
    }

    await router.push('/');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message ||
            error.response?.data?.title ||
            'Veprimi deshtoi. Kontrollo backend-in dhe konfigurimin e email-it.';
    } else {
      errorMessage.value = 'Nuk u arrit lidhja me backend-in.';
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.auth-card {
  display: grid;
  gap: 1.5rem;
}

.auth-card__header {
  display: grid;
  gap: 0.5rem;
}

.auth-card__eyebrow {
  margin: 0;
  color: #60a5fa;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-card__header h2 {
  margin: 0;
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  font-weight: 600;
  line-height: 1.05;
}

.auth-card__description {
  margin: 0;
  color: #94a3b8;
  line-height: 1.6;
}

.auth-form {
  display: grid;
  gap: 1rem;
}

.auth-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
}

.auth-field {
  display: grid;
  gap: 0.45rem;
}

.auth-field span {
  color: #cbd5e1;
  font-size: 0.84rem;
  font-weight: 500;
}

.auth-submit {
  width: 100%;
  margin-top: 0.25rem;
}

.form-error {
  margin: 0;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(248, 113, 113, 0.35);
  border-radius: 0.9rem;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-size: 0.92rem;
}

@media (max-width: 640px) {
  .auth-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
