<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  type: 'text' | 'textarea' | 'number';
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="type === 'textarea' ? 'textarea' : 'input'"
      :name="props.name"
      :type="props.type"
      :disabled="props.disabled"
      class="w-full"
      :class="{
        'input': type !== 'textarea',
        'textarea': type === 'textarea',
        'input-error': !!props.error,
      }"
    />
    <p v-if="props.error" class="label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
