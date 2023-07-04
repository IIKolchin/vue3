<template>
  <div>
    <img
      class="preloader__header"
      src="@/assets/loader_header.gif"
      v-show="this.$store.loadCartProducts"
      alt="Иконка загрузки"
    />
    <router-link
    v-show="!this.$store.loadCartProducts"
      class="header__cart"
      :to="{ name: 'cart' }"
      aria-label="Корзина с товарами"
    >
      <svg width="30" height="21" fill="currentColor">
        <use xlink:href="#icon-cart"></use>
      </svg>
      <span class="header__count" aria-label="Количество товаров">{{
        this.$store.state.cartProducts.length
      }}</span>
    </router-link>
  </div>
</template>
