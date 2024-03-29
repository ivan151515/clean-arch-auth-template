import { UserEntity } from "../../../../core/entities/user";
import { verifyEmail } from "../../../../use-cases/auth";
import { MockCryptoService } from "../../../mocks/MockCryptoService";
import MockEmailService from "../../../mocks/MockEmailService";
import { MockUserRepository } from "../../../mocks/MockUserRepo";

let emailSpy: jest.SpyInstance<Promise<void>, [to: string], unknown>;

let hashSpy: jest.SpyInstance<string, [code: string], unknown>;
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
          null,
          null
        )
      )
    );
  hashSpy = jest
    .spyOn(MockCryptoService.prototype, "hashEmailCode")
    .mockReturnValue("hashedcode");
  emailSpy = jest
    .spyOn(MockEmailService.prototype, "sendConfirmEmailVerified")
    .mockReturnValue(Promise.resolve());
}); // MockCryptoService
beforeEach(() => {
  emailSpy.mockClear();
  hashSpy.mockClear();
  repoUpdateOneSpy.mockClear();
});
describe("verify-email use case", () => {
  test("updateuser repo sends back updated object, happy path", async () => {
    const res = await verifyEmail(
      new MockCryptoService(),
      new MockUserRepository(),
      new MockEmailService(),
      "code"
    );
    expect(res).toBe(true);
    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith("email@email.com");
    expect(hashSpy).toHaveBeenCalledTimes(1);
    expect(hashSpy).toHaveBeenCalledWith("code");
    expect(repoUpdateOneSpy).toHaveBeenCalledTimes(1);
    expect(repoUpdateOneSpy).toHaveBeenCalledWith(
      {
        emailVerificationCode: "hashedcode",
        emailVerified: false,
      },
      {
        emailVerified: true,
      }
    );
  });
  test("update user repo sends back null, throws", async () => {
    repoUpdateOneSpy.mockReturnValueOnce(Promise.resolve(null));
    const result = verifyEmail(
      new MockCryptoService(),
      new MockUserRepository(),
      new MockEmailService(),
      "code"
    );
    await expect(result).rejects.toThrow(
      /invalid verification code or already verified/i
    );
    expect(emailSpy).not.toHaveBeenCalled();
    expect(hashSpy).toHaveBeenCalledTimes(1);
    expect(repoUpdateOneSpy).toHaveBeenCalledTimes(1);
  });
});
