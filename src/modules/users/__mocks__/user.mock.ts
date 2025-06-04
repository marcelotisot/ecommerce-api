import { User } from "../entities/user.entity";

export const mockUser = {
  id: "551e0d10-473d-49b2-b8aa-16465abb2f7f",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: new Date(),
  fullName: "Test User",
  email: "testuser@mail.com",
  password: "Abc123",
  isActive: true,
  roles: ["user"]
} as User;