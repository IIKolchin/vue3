<!-- eslint-disable vuejs-accessibility/form-control-has-label -->
<template>
  <BaseFormField :title="title" :error="error">
    <input
      class="form__input"
      type="text"
      :placeholder="placeholder"
      v-model="dataValue"
    />
  </BaseFormField>
</template>

<script>
import formFieldMixin from '../mixins/formFieldMixin';

export default {
  mixins: [formFieldMixin],
};
</script>
