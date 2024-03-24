import { CryptoService } from "../core/abstracts/cryptoService";
import { EmailService } from "../core/abstracts/emailService";
import { UserRepository } from "../core/abstracts/userRepo";

interface LoginDTO {
  email: string;
  password: string;
}
type LoggedInUserDTO = {
  email: string;
  id: number;
};
interface RegisterDTO {
  email: string;
  password: string;
}

export const register = async (
  registerDto: RegisterDTO,
  emailService: EmailService,
  userRepo: UserRepository,
  cryptoService: CryptoService
) => {
  const { email, password } = registerDto;
  const userExists = await userRepo.findByEmail(email, false);
  if (userExists) {
    throw new Error("already exist");
  }
  //TODO: CHEKC IF NEED AWAIT OR NOT
  const hashedPassword = await cryptoService.hash(password);
  const verificationCode = cryptoService.createCode();
  const verificationCodeHash = await cryptoService.hash(verificationCode);

  const user = await userRepo.create({
    email,
    emailVerificationCode: verificationCodeHash,
    emailVerified: false,
    password: hashedPassword,
  });
  if (!user) {
    throw new Error("Somehting went wrong");
  }
  void emailService.sendEmailVerficiation(email, verificationCode);

  return true;
};

export const login = async (
  loginDto: LoginDTO,
  cryptoService: CryptoService,
  userRepo: UserRepository
) => {
  const { email, password } = loginDto;
  const user = await userRepo.findByEmail(email, true);

  if (!user) {
    //TODO: HANDLE PROPERLY
    throw new Error("User does not exist");
  }
  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }
  const verified = cryptoService.verifyHash(user.password, password);
  if (!verified) {
    throw new Error("Incorrect credentials");
  }

  const LoggedInUserDTO: LoggedInUserDTO = {
    email: user.email,
    id: user.id,
  };
  return LoggedInUserDTO;
};
