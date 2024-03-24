export abstract class EmailService {
  abstract sendEmailVerficiation(to: string, link: string): Promise<void>;
  abstract sendPasswordResetLink(to: string, link: string): Promise<void>;
  abstract sendConfirmEmailVerified(to: string): Promise<void>;
  abstract sendConfirmPasswordReset(to: string): Promise<void>;
}
