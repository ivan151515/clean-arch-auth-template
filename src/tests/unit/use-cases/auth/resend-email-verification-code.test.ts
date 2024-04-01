import { UserEntity } from "../../../../core/entities/user";
import { resendEmailVerificationCode } from "../../../../use-cases/auth";
import { MockCryptoService } from "../../../mocks/MockCryptoService";
import MockEmailService from "../../../mocks/MockEmailService";
import { MockUserRepository } from "../../../mocks/MockUserRepo";

let emailSpy: jest.SpyInstance<
  Promise<void>,
  [to: string, link: string],
  unknown
>;
let generateCodeSpy: jest.SpyInstance<string, [], unknown>;
let hashSpy: jest.SpyInstance<string, [_code: string], unknown>;
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
  unknown
>;
let findByEmailSpy: jest.SpyInstance<
  Promise<UserEntity | null>,
  [email: string, includePassword: boolean],
  unknown
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
  generateCodeSpy = jest
    .spyOn(MockCryptoService.prototype, "createCode")
    .mockReturnValue("resetcode");
  hashSpy = jest
    .spyOn(MockCryptoService.prototype, "hashEmailCode")
    .mockReturnValue("hashedcode");
  emailSpy = jest
    .spyOn(MockEmailService.prototype, "sendEmailVerficiation")
    .mockReturnValue(Promise.resolve());
  findByEmailSpy = jest
    .spyOn(MockUserRepository.prototype, "findByEmail")
    .mockImplementation(async (email: string, _includePassword: boolean) => {
      return await Promise.resolve(
        new UserEntity(email, "password", 5, "code", true, null, null)
      );
    });
}); // MockCryptoService
beforeEach(() => {
  emailSpy.mockClear();
  hashSpy.mockClear();
  repoUpdateOneSpy.mockClear();
  generateCodeSpy.mockClear();
  findByEmailSpy.mockClear();
});
describe("resend email verification", () => {
  test("User already verified, throws an error", async () => {
    const result = resendEmailVerificationCode(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      "email@email.com"
    );
    await expect(result).rejects.toThrow();
    expect(findByEmailSpy).toHaveBeenCalledWith("email@email.com", false);
    expect(repoUpdateOneSpy).not.toHaveBeenCalled();
    expect(emailSpy).not.toHaveBeenCalled();
  });
  test("User not found, throws an error", async () => {
    findByEmailSpy.mockReturnValueOnce(Promise.resolve(null));
    const result = resendEmailVerificationCode(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      "email@email.com"
    );
    await expect(result).rejects.toThrow();
    expect(findByEmailSpy).toHaveBeenCalledWith("email@email.com", false);
    expect(repoUpdateOneSpy).not.toHaveBeenCalled();
    expect(emailSpy).not.toHaveBeenCalled();
  });

  test("user does not have verification code, generates new one, and saves to repository", async () => {
    findByEmailSpy.mockReturnValueOnce(
      Promise.resolve(
        new UserEntity(
          "email@email.com",
          "pasaswr, ",
          2,
          null,
          false,
          null,
          null
        )
      )
    );
    await resendEmailVerificationCode(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      "email@email.com"
    );
    expect(generateCodeSpy).toHaveBeenCalledTimes(1);
    expect(hashSpy).toHaveBeenCalledTimes(1);
    expect(hashSpy).toHaveBeenCalledWith("resetcode");
    expect(repoUpdateOneSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith("email@email.com", "resetcode");
    expect(repoUpdateOneSpy).toHaveBeenCalledWith(
      { email: "email@email.com" },
      {
        emailVerificationCode: "hashedcode",
      }
    );
  });
  test("user found, has verification code, is not verified, the code is resent, user not updated in repository", async () => {
    findByEmailSpy.mockReturnValueOnce(
      Promise.resolve(
        new UserEntity(
          "email@email.com",
          "pasaswr, ",
          2,
          "code",
          false,
          null,
          null
        )
      )
    );
    await resendEmailVerificationCode(
      new MockUserRepository(),
      new MockEmailService(),
      new MockCryptoService(),
      "email@email.com"
    );

    expect(generateCodeSpy).not.toHaveBeenCalled();
    expect(hashSpy).not.toHaveBeenCalled();
    expect(repoUpdateOneSpy).not.toHaveBeenCalled();
    expect(emailSpy).toHaveBeenCalledWith("email@email.com", "code");
  });
  // test("update user repo sends back null, throws", async () => {});
});
