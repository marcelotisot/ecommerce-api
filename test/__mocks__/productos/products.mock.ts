import { Product } from "@modules/products/entities/product.entity";

export const mockProducts: Product[] = [
  { id: '1', title: 'P1', price: 10 } as Product,
  { id: '2', title: 'P2', price: 20 } as Product,
];

export const mockProduct: Product = { 
  id: 'prod1', 
  title: 'Product', 
  price: 50 
} as Product;