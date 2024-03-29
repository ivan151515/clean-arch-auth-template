import { UserEntity } from "../../../../core/entities/user";
import { forgotPassword } from "../../../../use-cases/auth";
import { MockCryptoService } from "../../../mocks/MockCryptoService";
import MockEmailService from "../../../mocks/MockEmailService";
import { MockUserRepository } from "../../../mocks/MockUserRepo";

let emailSpy: jest.SpyInstance<
  Promise<void>,
  [to: string, link: string],
  unknown
>;
let generateCodeSpy: jest.SpyInstance<string, [], unknown>;
let hashSpy: jest.SpyInstance<Promise<string>, [password: string], unknown>;
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
    .spyOn(MockCryptoService.prototype, "generatePasswordResetToken")
    .mockReturnValue("resetcode");
  hashSpy = jest
    .spyOn(MockCryptoService.prototype, "hash")
    .mockReturnValue(Promise.resolve("hashedcode"));
  emailSpy = jest
    .spyOn(MockEmailService.prototype, "sendPasswordResetLink")
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
describe("forgot password", () => {
  test("email is found in db, happy path", async () => {
    await forgotPassword(
      new MockEmailService(),
      new MockUserRepository(),
      new MockCryptoService(),
      "email@email.com"
    );
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith("email@email.com", "resetcode");
    expect(findByEmailSpy).toHaveBeenCalledWith("email@email.com", false);
    expect(generateCodeSpy).toHaveBeenCalledTimes(1);
    expect(hashSpy).toHaveBeenCalledTimes(1);
    expect(hashSpy).toHaveBeenCalledWith("resetcode");
    expect(repoUpdateOneSpy).toHaveBeenCalledTimes(1);
    expect(repoUpdateOneSpy.mock.lastCall?.[1].passwordResetToken).toContain(
      "hashedcode"
    );
    expect(
      repoUpdateOneSpy.mock.lastCall?.[1].passwordResetTokenExpiresAt instanceof
        Date
    ).toBe(true);
  });
  test("Find by email doesnt find user, throws", async () => {
    findByEmailSpy.mockReturnValueOnce(Promise.resolve(null));
    const res = forgotPassword(
      new MockEmailService(),
      new MockUserRepository(),
      new MockCryptoService(),
      "email@email.com"
    );
    await expect(res).rejects.toThrow();
    expect(findByEmailSpy).toHaveBeenCalledWith("email@email.com", false);
    expect(emailSpy).not.toHaveBeenCalled();
    expect(repoUpdateOneSpy).not.toHaveBeenCalled();
    expect(hashSpy).not.toHaveBeenCalled();
    expect(generateCodeSpy).not.toHaveBeenCalled();
  });
  // test("update user repo sends back null, throws", async () => {});
});
