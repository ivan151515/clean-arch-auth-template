import { UserEntity } from "../../../../core/entities/user";
import { forgotPassword, verifyEmail } from "../../../../use-cases/auth";
import { MockCryptoService } from "../../../mocks/MockCryptoService";
import MockEmailService from "../../../mocks/MockEmailService";
import { MockUserRepository } from "../../../mocks/MockUserRepo";

let emailSpy: jest.SpyInstance<Promise<void>, [to: string, link: string], any>;
let generateCodeSpy: jest.SpyInstance<string, [], any>;
let hashSpy: jest.SpyInstance<Promise<string>, [password: string], any>;
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
    .mockImplementation(async (email: string, includePassword: boolean) => {
      return new UserEntity(email, "password", 5, "code", true, null, null);
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
  test("email is found in db, happy path", async () => {});
  test("", async () => {});
  // test("update user repo sends back null, throws", async () => {});
});
