/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserEntity } from "../../../../core/entities/user";
import { resetPassword } from "../../../../use-cases/auth";
import { MockCryptoService } from "../../../mocks/MockCryptoService";
import MockEmailService from "../../../mocks/MockEmailService";
import { MockUserRepository } from "../../../mocks/MockUserRepo";

let emailSpy: jest.SpyInstance<Promise<void>, [to: string], any>;
let hashSpy: jest.SpyInstance<Promise<string>, [password: string], any>;
let verifyHashSpy: jest.SpyInstance<
  Promise<boolean>,
  [plaintext: string, hash: string],
  any
>;
let repoUpdateOneSpy: jest.SpyInstance<
  Promise<UserEntity | null>,
  [
    query:
      | {
          id: number;
          email: never;
        }
      | {
          id: never;
          email: string;
        },
    updateFields: Partial<UserEntity>
  ],
  any
>;
let findByEmailSpy: jest.SpyInstance<
  Promise<UserEntity | null>,
  [email: string, includePassword: boolean],
  any
>;

beforeAll(() => {
  repoUpdateOneSpy = jest
    .spyOn(MockUserRepository.prototype, "updateOne")
    .mockReturnValue(
      Promise.resolve(
        new UserEntity(
          "email@email.com",
          "password",
          2,
          "code",
          true,
          "hashedcode",
          new Date(Date.now() + 1000 * 3600)
        )
      )
    );
  verifyHashSpy = jest
    .spyOn(MockCryptoService.prototype, "verifyHash")
    .mockReturnValue(Promise.resolve(true));

  hashSpy = jest
    .spyOn(MockCryptoService.prototype, "hash")
    .mockReturnValue(Promise.resolve("hashedcode"));
  emailSpy = jest
    .spyOn(MockEmailService.prototype, "sendConfirmPasswordReset")
    .mockReturnValue(Promise.resolve());
  findByEmailSpy = jest
    .spyOn(MockUserRepository.prototype, "findByEmail")
    .mockImplementation(async (email: string, _includePassword: boolean) => {
      return await Promise.resolve(
        new UserEntity(
          email,
          "password",
          5,
          "code",
          true,
          "resetCode",
          new Date(Date.now() + 1000 * 3600)
        )
      );
    });
}); // MockCryptoService
beforeEach(() => {
  emailSpy.mockClear();
  hashSpy.mockClear();
  repoUpdateOneSpy.mockClear();
  verifyHashSpy.mockClear();
  findByEmailSpy.mockClear();
});
describe("forgot password", () => {
  test("user found with email, reset password token valid, password changed succesfully", async () => {
    const res = resetPassword(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      { token: "token", email: "email@email.com", password: "password" }
    );
    await expect(res).resolves.not.toThrow();
    expect(findByEmailSpy).toHaveBeenCalledWith("email@email.com", false);
    expect(verifyHashSpy).toHaveBeenCalledWith("token", "resetCode");
    expect(hashSpy).toHaveBeenCalledWith("password");
    expect(repoUpdateOneSpy).toHaveBeenCalledWith(
      { email: "email@email.com" },
      {
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
        password: "hashedcode",
      }
    );
    expect(emailSpy).toHaveBeenCalledTimes(1);
  });
  test("user not found with email, throws", async () => {
    findByEmailSpy.mockReturnValueOnce(Promise.resolve(null));
    const result = resetPassword(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      {
        email: "emeail@email.com",
        password: "password",
        token: "Otken",
      }
    );
    await expect(result).rejects.toThrow(/user not found or invalid token/i);
    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).not.toHaveBeenCalled();
    expect(verifyHashSpy).not.toHaveBeenCalled();
    expect(repoUpdateOneSpy).not.toHaveBeenCalled();
  });
  test("user found with email, token expired throws", async () => {
    findByEmailSpy.mockReturnValueOnce(
      Promise.resolve(
        new UserEntity(
          "email@emial.com",
          "psa",
          2,
          null,
          true,
          "token",
          new Date(Date.now() - 1000 * 36000)
        )
      )
    );
    const result = resetPassword(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      {
        email: "emasldča",
        password: "Pasasdad",
        token: "TOKEN",
      }
    );
    await expect(result).rejects.toThrow(/user not found or invalid token/i);
    expect(repoUpdateOneSpy).not.toHaveBeenCalled();
    expect(emailSpy).not.toHaveBeenCalled();
  });
  test("user found with email, invalid token, throws", async () => {
    verifyHashSpy.mockReturnValueOnce(Promise.resolve(false));
    const result = resetPassword(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      {
        email: "emasldča",
        password: "Pasasdad",
        token: "TOKEN",
      }
    );
    await expect(result).rejects.toThrow(/invalid token/);
    expect(repoUpdateOneSpy).not.toHaveBeenCalled();
    expect(emailSpy).not.toHaveBeenCalled();
  });
  test("user found, with no token, throws", async () => {
    findByEmailSpy.mockReturnValueOnce(
      Promise.resolve(
        new UserEntity("email@emial.com", "psa", 2, null, true, null, null)
      )
    );
    const result = resetPassword(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      {
        email: "emasldča",
        password: "Pasasdad",
        token: "TOKEN",
      }
    );
    await expect(result).rejects.toThrow(/user not found or invalid token/);
    expect(repoUpdateOneSpy).not.toHaveBeenCalled();
    expect(emailSpy).not.toHaveBeenCalled();
  });
  // test("update user repo sends back null, throws", async () => {});
});
