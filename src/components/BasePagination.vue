<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
        href="#"
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': page === 1}"
        aria-label="Предыдущая страница"
        @click.prevent="prevArrowClick"

      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a
        href="#"
        class="pagination__link"
        :class="{ 'pagination__link--current': pageNumber === page }"
        @click.prevent="paginate(pageNumber)"
      >
        {{ pageNumber }}
      </a>
    </li>

    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': page === pages}"
        href="#"
        aria-label="Следующая страница"
        @click.prevent="nextArrowClick"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['modelValue', 'count', 'perPage'],
  computed: {
    page() {
      return this.modelValue;
    },
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
    isDisabled() {
      console.log(this.page === 1);
      return this.page === 1;
    },
  },
  methods: {
    paginate(page) {
      this.$emit('update:modelValue', page);
    },
    prevArrowClick() {
      return this.page === 1 ? null : this.paginate(this.page - 1);
    },
    nextArrowClick() {
      return this.page === this.pages ? null : this.paginate(this.page + 1);
    },
  },
};
</script>
