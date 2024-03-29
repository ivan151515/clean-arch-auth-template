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
  const verificationCodeHash = cryptoService.hashEmailCode(verificationCode);

  const user = await userRepo.create({
    email,
    emailVerificationCode: verificationCodeHash,
    emailVerified: false,
    password: hashedPassword,
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
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
  const verified = await cryptoService.verifyHash(user.password, password);
  if (!verified) {
    throw new Error("Incorrect credentials");
  }

  const LoggedInUserDTO: LoggedInUserDTO = {
    email: user.email,
    id: user.id,
  };
  return LoggedInUserDTO;
};

export const verifyEmail = async (
  cryptoService: CryptoService,
  userRepository: UserRepository,
  emailService: EmailService,
  code: string
) => {
  const hashedEmailCode = cryptoService.hashEmailCode(code);
  const user = await userRepository.updateOne(
    { emailVerificationCode: hashedEmailCode, emailVerified: false },
    {
      emailVerified: true,
    }
  );
  if (!user) {
    throw new Error("invalid verification code or already verified");
  }
  void emailService.sendConfirmEmailVerified(user.email);

  return true;
};

export const forgotPassword = async (
  emailService: EmailService,
  userRepository: UserRepository,
  cryptoService: CryptoService,
  email: string
) => {
  let user = await userRepository.findByEmail(email, false);
  if (!user) throw new Error();
  const resetToken = cryptoService.generatePasswordResetToken();
  const hashedToken = await cryptoService.hash(resetToken);

  user = await userRepository.updateOne(
    { email },
    {
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
    }
  );
  if (!user) {
    //TODO: HANDLE PROPERLY LATER
    throw new Error();
  } else {
    emailService.sendPasswordResetLink(email, resetToken);
  }
};

export const resetPassword = async (
  userRepository: UserRepository,
  emailService: EmailService,
  cryptoService: CryptoService
) => {};
