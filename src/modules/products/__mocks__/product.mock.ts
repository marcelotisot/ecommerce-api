import { Product } from "../entities/product.entity";

export const mockProduct = {
  id: "856b302c-e44f-4b33-afef-1e55f670378d",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  name: "Test product",
  slug: "test-product",
  description: "Test product description",
  price: 2500.00,
  stock: 100,
  category: {
    id: "77243d1a-1031-412a-a911-ba12924321eb",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
    name: "Test cat 1",
    slug: "test-cat-1"
  }
} as Product;