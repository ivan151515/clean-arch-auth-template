import { EmailService } from "../../core/abstracts/emailService";

class MockEmailService implements EmailService {
  sendEmailVerficiation(to: string, link: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendPasswordResetLink(to: string, link: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendConfirmEmailVerified(to: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendConfirmPasswordReset(to: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default MockEmailService;
