/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserEntity } from "../../../../core/entities/user";
import { register } from "../../../../use-cases/auth";
import { MockCryptoService } from "../../../mocks/MockCryptoService";
import MockEmailService from "../../../mocks/MockEmailService";
import { MockUserRepository } from "../../../mocks/MockUserRepo";

let emailSpy: jest.SpyInstance<Promise<void>, [to: string, link: string], any>;
let repoCreateSpy: jest.SpyInstance<
  Promise<UserEntity | null>,
  [data: Omit<UserEntity, "id">],
  any
>;
let verificationEmailCodeCreateSpy: jest.SpyInstance<string, [], any>;
let hashSpy: jest.SpyInstance<Promise<string>, [password: string], any>;
let findByEmailMock: jest.SpyInstance<
  Promise<UserEntity | null>,
  [email: string, includePassword: boolean],
  any
>;
let hashEmailSpy: jest.SpyInstance<string, [code: string], any>;
beforeAll(() => {
  findByEmailMock = jest
    .spyOn(MockUserRepository.prototype, "findByEmail")
    .mockReturnValue(Promise.resolve(null));

  hashSpy = jest
    .spyOn(MockCryptoService.prototype, "hash")
    .mockReturnValue(Promise.resolve("hashedpassword"));
  hashEmailSpy = jest
    .spyOn(MockCryptoService.prototype, "hashEmailCode")
    .mockReturnValue("hashedcode");
  verificationEmailCodeCreateSpy = jest
    .spyOn(MockCryptoService.prototype, "createCode")
    .mockReturnValue("code");
  emailSpy = jest
    .spyOn(MockEmailService.prototype, "sendEmailVerficiation")
    .mockReturnValue(Promise.resolve());
  repoCreateSpy = jest
    .spyOn(MockUserRepository.prototype, "create")
    .mockReturnValue(
      Promise.resolve(
        new UserEntity(
          "email@email.com",
          "hashedpassword",
          2,
          "codee",
          false,
          null,
          null
        )
      )
    );
}); // MockCryptoService
beforeEach(() => {
  repoCreateSpy.mockClear();
  emailSpy.mockClear();
  hashSpy.mockClear();
  verificationEmailCodeCreateSpy.mockClear();
  findByEmailMock.mockClear();
});
describe("register use case", () => {
  test("user already exist, throws error", async () => {
    jest
      .spyOn(MockUserRepository.prototype, "findByEmail")
      .mockReturnValueOnce(
        Promise.resolve(
          new UserEntity("EMAIL", "PAS", 3, "copde", true, null, null)
        )
      );
    const result = register(
      { email: "email", password: "password" },
      new MockEmailService(),
      new MockUserRepository(),
      new MockCryptoService()
    );
    await expect(result).rejects.toThrow(/already exist/i);
    expect(findByEmailMock).toHaveBeenCalled();
    expect(emailSpy).not.toHaveBeenCalled();
    expect(repoCreateSpy).not.toHaveBeenCalled();
  });
  test("user not found, hashing mehtod gets invoked, sendemail gets evoked, repository create method gets invoked, returns true", async () => {
    const result = await register(
      { email: "email@email.com", password: "password" },
      new MockEmailService(),
      new MockUserRepository(),
      new MockCryptoService()
    );
    expect(result).toBe(true);
    expect(repoCreateSpy).toHaveBeenCalledTimes(1);
    expect(repoCreateSpy).toHaveBeenCalledWith({
      email: "email@email.com",
      emailVerificationCode: "hashedcode",
      emailVerified: false,
      password: "hashedpassword",
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    });
    expect(hashSpy).toHaveBeenCalledTimes(1);
    expect(hashEmailSpy).toHaveBeenCalledTimes(1);
    expect(hashSpy).toHaveBeenCalledWith("password");
    expect(verificationEmailCodeCreateSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledTimes(1);
  });
});
