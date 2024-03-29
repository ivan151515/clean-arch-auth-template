import { UserRepository } from "../../../core/abstracts/userRepo";
import { UserEntity } from "../../../core/entities/user";

class UserRepoImpl extends UserRepository {
  async findByEmail(
    _email: string,
    _includePassword: boolean
  ): Promise<UserEntity | null> {
    await Promise.resolve(null);
    return null;
  }

  async findById(_id: number): Promise<UserEntity | null> {
    await Promise.resolve(null);
    return null;
  }
  async updateOne(
    _query: { id: number; email: never } | { id: never; email: string },
    _updateFields: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    await Promise.resolve(null);
    return null;
  }
  async create(_data: Omit<UserEntity, "id">): Promise<UserEntity | null> {
    await Promise.resolve(true);
    return null;
  }
}

export default new UserRepoImpl();
