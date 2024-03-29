import { EmailService } from "../../core/abstracts/emailService";

class MockEmailService implements EmailService {
  sendEmailVerficiation(_to: string, _link: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendPasswordResetLink(_to: string, _link: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendConfirmEmailVerified(_to: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendConfirmPasswordReset(_to: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default MockEmailService;
