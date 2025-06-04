import { PaginatedResult } from "../../../common";
import { Product } from '../entities/product.entity';

export const mockPaginatedProducts: PaginatedResult<Product> = {
  data: [
    {
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
		},

    {
			id: "3421cf82-bb13-4a5c-8394-ebbf01caac00",
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
			name: "Test product 2",
			slug: "test-product-2",
			description: "Test product 2 description",
			price: 12.00,
			stock: 150,
			category: {
				id: "77243d1a-1031-412a-a911-ba12924321eb",
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: new Date(),
				name: "Test cat 1",
				slug: "test-cat-1"
			}
		},

    {
			id: "80f24a35-e577-405b-9806-f215f5cb68c7",
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
			name: "Test product 3",
			slug: "test-product-3",
			description: "Test product 3 description",
			price: 12.00,
			stock: 150,
			category: {
				id: "c67c06cc-e89b-40b4-ba62-1f4ff4f7d20c",
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: new Date(),
				name: "Test cat 2",
				slug: "test-cat-2"
			}
		},
  ] as Product[],
  meta: {
    total: 3,
    per_page: 10,
    current_page: 1,
    last_page: 1
  }
} 