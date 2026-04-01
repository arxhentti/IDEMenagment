<template>
  <div class="loader-wrap" role="status" aria-live="polite">
    <span class="spinner" />
    <span>Loading...</span>
  </div>
</template>

<style scoped>
.loader-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: #4b5563;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #cbd5e1;
  border-top-color: #2563eb;
  border-radius: 999px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
