import { hash } from "argon2";
import { CryptoService } from "../../../../core/abstracts/cryptoService";
import { UserRepository } from "../../../../core/abstracts/userRepo";
import { UserEntity } from "../../../../core/entities/user";
import { login } from "../../../../use-cases/auth";
import { MockCryptoService } from "../../../mocks/MockCryptoService";
import { MockUserRepository } from "../../../mocks/MockUserRepo";
beforeAll(() => {
  //   jest.mock("../../../../core/entities/user", () => {
  //     // Use a variable prefixed with mock for lazy loading
  //     const mockUserEntity = jest.requireActual("../../../../core/entities/user");
  //     return mockUserEntity;
  //   });
  const findByEmailMock = jest
    .spyOn(MockUserRepository.prototype, "findByEmail")
    .mockImplementation(async (email: string, includePassword: boolean) => {
      return new UserEntity(email, "sdasda", 5, "code", true);
    });
  const verifyHashMock = jest
    .spyOn(MockCryptoService.prototype, "verifyHash")
    .mockImplementation(async (plainText: string, hashedPassword: string) => {
      console.log(plainText, hashedPassword);
      return plainText == hashedPassword;
    });
  //   jest.mock("../../../mocks/MockUserRepo", () => {
  //     // Works and lets you check for constructor calls:

  //     return {
  //       MockUserRepository: jest.fn().mockImplementation(() => {
  //         return {
  //           MockUserRepository: (email: string, withPassword: boolean) =>
  //             jest.fn().mockReturnValue(null),
  //         };
  //       }),
  //     };
  //   });
  //   jest.mock("../../../mocks/MockCryptoService", () => {
  //     // Works and lets you check for constructor calls:
  //     return {
  //       MockCryptoService: jest.fn().mockImplementation(() => {
  //         return { verifiyHash: () => {} };
  //       }),
  //     };
  //   });
}); // MockCryptoService

// const MockCryptoService: CryptoService = jest.mock(
//   "../../../mocks/MockCryptoService",
//   () => {
//     return function () {
//       return {
//         verifyHash: (plaintext: string, hashed: string) => true,
//       };
//     };
//   }
// );
// const mockRepo: UserRepository = jest.mock(
//   "../../../core/abstracts/userRepo",
//   () => {
//     mockRepo.create = jest.fn();
//     mockRepo.findByEmail = jest.fn();
//     mockRepo.findById = jest.fn();
//     mockRepo.updateOne = jest.fn();
//   }
// );
describe("login use case", () => {
  test("user not found, throws error", async () => {
    const res = await login(
      {
        email: "email",
        password: "password",
      },
      new MockCryptoService(),
      new MockUserRepository()
    );
    console.log(res);
    // expect();
    // expect(result).toThrow();
    // (
    //   UserRepository as jest.MockedClass<typeof UserRepository>
    // ).mockImplementation(() => ({
    //   findById: jest.fn().mockReturnValue(new UserEntity("")),
    // }));
    // const user = await login(
    //   {
    //     email: "test@test.com",
    //     password: "password",
    //   }
    //   //   new MockCryptoService(),
    //   //   new MockUserRepository()
    // );
    // console.log(user);
  });
});
