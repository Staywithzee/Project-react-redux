import { createSelector } from '@reduxjs/toolkit';

const selectSearchQuery = state => state.ui.searchQuery;
const selectActiveCategory = state => state.ui.activeCategory;

export const selectFilteredProducts = createSelector(
  [
    (state, products) => products,
    selectSearchQuery,
    selectActiveCategory,
  ],
  (products, search, category) => {
    if (!products) return [];
    return products.filter(p => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }
);
