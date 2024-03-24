import { UserRepository } from "../../../core/abstracts/userRepo";
import { UserEntity } from "../../../core/entities/user";

class UserRepoImpl extends UserRepository {
  async findByEmail(
    email: string,
    includePassword: boolean
  ): Promise<UserEntity | null> {
    return null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    return null;
  }
  async updateOne(
    query: { id: number; email: never } | { id: never; email: string },
    updateFields: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    return null;
  }
  async create(data: Omit<UserEntity, "id">): Promise<UserEntity | null> {
    return null;
  }
}
