import { PaginatedResult } from "src/common";
import { User } from "../entities/user.entity";

export const mockPaginatedUsers: PaginatedResult<User> = {
  data: [
    {
			id: "551e0d10-473d-49b2-b8aa-16465abb2f7f",
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
			fullName: "Test User",
			email: "testuser@mail.com",
			password: "Abc123",
			isActive: true,
			roles: ["user"]
		},
    {
			id: "d53b9a7d-2178-450b-9d66-a733620576ee",
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
			fullName: "Test User 2",
			email: "testuser2@mail.com",
			password: "Abc123",
			isActive: true,
			roles: ["user"]
		}
  ] as User[],
  meta: {
    total: 2,
    per_page: 10,
    current_page: 1,
    last_page: 1
  }
}