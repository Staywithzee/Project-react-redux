import { createSelector } from '@reduxjs/toolkit';

export const selectCartItems = state => state.cart.items;

export const selectCartTotal = createSelector(
  selectCartItems,
  items => items.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const selectCartItemCount = createSelector(
  selectCartItems,
  items => items.reduce((count, item) => count + item.quantity, 0)
);
