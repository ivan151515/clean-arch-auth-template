import { UserRepository } from "../../core/abstracts/userRepo";
import { UserEntity } from "../../core/entities/user";

export class MockUserRepository extends UserRepository {
  findByEmail(
    _email: string,
    _includePassword: boolean
  ): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  findById(_id: number): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  updateOne(
    _query: { id: number; email: never } | { id: never; email: string },
    _updateFields: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  create(_data: Omit<UserEntity, "id">): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
}
