import { UserRepository } from "../../core/abstracts/userRepo";
import { UserEntity } from "../../core/entities/user";

export class MockUserRepository extends UserRepository {
  findByEmail(
    email: string,
    includePassword: boolean
  ): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  findById(id: number): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  updateOne(
    query: { id: number; email: never } | { id: never; email: string },
    updateFields: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  create(data: Omit<UserEntity, "id">): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
}
