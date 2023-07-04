import { createStore } from 'vuex';
import axios from 'axios';
import API_BASE_URL from '../config';

export default createStore({
  state: {
    cartProducts: [],
    userAccessKey: null,
    cartProductsData: [],
    loadCartProducts: false,
    orderInfo: null,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, amount }) {
      const item = state.cartProducts.find((el) => el.productId === productId);

      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, productId) {
      state.cartProducts = state.cartProducts.filter((el) => el.productId !== productId);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,

      }));
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        // eslint-disable-next-line prefer-destructuring
        const product = state.cartProductsData.find((p) => p.product.id === item.productId).product;

        return {
          ...item,
          product: {
            ...product,
            image: product.image.file.url,
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce(
        (acc, item) => item.product.price * item.amount + acc,
        0,
      );
    },
    cartTotalAmount(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => item.amount + acc, 0);
    },

  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((res) => {
          context.commit('updateOrderInfo', res.data);
        });
    },
    loadCart(context) {
      this.loadCartProducts = true;
      return (new Promise((resolve) => setTimeout(resolve, 2000)))
        .then(() => axios
          .get(`${API_BASE_URL}/api/baskets`, {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          })
          .then((res) => {
            if (!context.state.userAccessKey) {
              localStorage.setItem('userAccessKey', res.data.user.accessKey);
              context.commit('updateUserAccessKey', res.data.user.accessKey);
            }
            this.loadCartProducts = false;
            context.commit('updateCartProductsData', res.data.items);
            context.commit('syncCartProducts');
          }));
    },
    addProductToCart(context, { productId, amount }) {
      return (new Promise((resolve) => setTimeout(resolve, 2000)))
        .then(() => axios.post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
          .then((res) => {
            context.commit('updateCartProductsData', res.data.items);
            context.commit('syncCartProducts');
          }));
    },
    deleteProductFromCart(context, { productId }) {
      context.commit('deleteProductFromCart', { productId });
      return axios.delete(
        `${API_BASE_URL}/api/baskets/products?userAccessKey=${context.state.userAccessKey}`,
        { data: { productId } },
      )
        .then((res) => {
          context.commit('updateCartProductsData', res.data.items);
          context.commit('syncCartProducts');
        });
    },
    updateCartProductAmount(context, { productId, amount }) {
      context.commit('updateCartProductAmount', { productId, amount });

      if (amount < 1) {
        return;
      }

      return axios.put(`${API_BASE_URL}/api/baskets/products`, {
        productId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((res) => {
          context.commit('updateCartProductsData', res.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
  },
});
