<template>
  <input
    class="input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    @input="handleInput"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
    type?: string;
    placeholder?: string;
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  emit('update:modelValue', target?.value ?? '');
};
</script>
