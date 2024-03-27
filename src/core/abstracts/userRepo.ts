import { UserEntity } from "../entities/user";

type updateUserQuery = Partial<UserEntity>;

export abstract class UserRepository {
  abstract findByEmail(
    email: string,
    includePassword: boolean
  ): Promise<UserEntity | null>;
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract updateOne(
    query: updateUserQuery,
    updateFields: Partial<UserEntity>
  ): Promise<UserEntity | null>;
  abstract create(data: Omit<UserEntity, "id">): Promise<UserEntity | null>;
}
