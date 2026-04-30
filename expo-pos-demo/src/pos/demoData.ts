export type InventoryCategory = 'Beverage' | 'Snack' | 'Fresh' | 'Household' | 'Grocery' | 'Pantry';

export type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  price: number;
  stock: number;
  velocity: number;
  trend: 'up' | 'down';
};

export const CATEGORY_OPTIONS: Array<InventoryCategory | 'All'> = [
  'All',
  'Beverage',
  'Snack',
  'Fresh',
  'Household',
  'Grocery',
  'Pantry',
];

const BRANDS = ['Northwind', 'Bluebird', 'Harbor', 'Summit', 'Daybreak', 'Field'];
const DESCRIPTORS = ['Crisp', 'Cold', 'Bright', 'Roasted', 'Silky', 'Bold', 'Golden'];
const PRODUCTS = [
  'Latte',
  'Soda',
  'Granola',
  'Olive Oil',
  'Pasta',
  'Trail Mix',
  'Sparkling',
  'Juice',
  'Soap',
  'Oats',
  'Tea',
  'Coffee',
  'Yogurt',
  'Rice',
  'Chips',
];

const CATEGORY_POOL: InventoryCategory[] = [
  'Beverage',
  'Snack',
  'Fresh',
  'Household',
  'Grocery',
  'Pantry',
];

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

const random = createSeededRandom(1337);

function pick<T>(list: T[]) {
  return list[Math.floor(random() * list.length)];
}

function formatPrice(value: number) {
  return Math.round(value * 100) / 100;
}

export const INVENTORY: InventoryItem[] = Array.from({ length: 1200 }, (_, index) => {
  const name = `${pick(BRANDS)} ${pick(DESCRIPTORS)} ${pick(PRODUCTS)}`;
  const price = formatPrice(2.5 + random() * 27.75);
  const stock = Math.floor(5 + random() * 140);
  const velocity = Math.floor(20 + random() * 80);
  const category = pick(CATEGORY_POOL);

  return {
    id: `sku-${index + 1}`,
    name,
    category,
    price,
    stock,
    velocity,
    trend: velocity > 60 ? 'up' : 'down',
  };
});
