import { UserEntity } from "../../../../core/entities/user";
import { login } from "../../../../use-cases/auth";
import { MockCryptoService } from "../../../mocks/MockCryptoService";
import { MockUserRepository } from "../../../mocks/MockUserRepo";
beforeAll(() => {
  jest
    .spyOn(MockUserRepository.prototype, "findByEmail")
    .mockImplementation(async (email: string, _includePassword: boolean) => {
      return await Promise.resolve(
        new UserEntity(email, "password", 5, "code", true, null, null)
      );
    });
  jest
    .spyOn(MockCryptoService.prototype, "verifyHash")
    .mockReturnValue(Promise.resolve(true));
});
describe("login use case", () => {
  test("user not found, throws error", async () => {
    jest
      .spyOn(MockUserRepository.prototype, "findByEmail")
      .mockReturnValueOnce(Promise.resolve(null));
    const result = login(
      { email: "email", password: "password" },
      new MockCryptoService(),
      new MockUserRepository()
    );
    await expect(result).rejects.toThrow(/does not exist/i);
  });
  test("user found, returns dto with email, and userid", async () => {
    const result = await login(
      { email: "email@test.com", password: "password" },
      new MockCryptoService(),
      new MockUserRepository()
    );
    expect(result.email).toBe("email@test.com");
    expect(result.id).toBe(5);
  });
  test("password not correct, throws", async () => {
    jest
      .spyOn(MockCryptoService.prototype, "verifyHash")
      .mockReturnValueOnce(Promise.resolve(false));
    const result = login(
      { email: "email", password: "password" },
      new MockCryptoService(),
      new MockUserRepository()
    );
    await expect(result).rejects.toThrow(/incorrect credentials/i);
  });
  test("user with not verified email, throws", async () => {
    jest
      .spyOn(MockUserRepository.prototype, "findByEmail")
      .mockReturnValueOnce(
        Promise.resolve(
          new UserEntity(
            "email@test.com",
            "password",
            5,
            "code",
            false,
            null,
            null
          )
        )
      );
    const result = login(
      { email: "email", password: "password" },
      new MockCryptoService(),
      new MockUserRepository()
    );
    await expect(result).rejects.toThrow(/not verified/);
  });
});
