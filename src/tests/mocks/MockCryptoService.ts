import { CryptoService } from "../../core/abstracts/cryptoService";

export class MockCryptoService implements CryptoService {
  generatePasswordResetToken(): string {
    throw new Error("Method not implemented.");
  }
  hashEmailCode(_code: string): string {
    throw new Error("Method not implemented.");
  }
  async hash(_password: string): Promise<string> {
    await Promise.resolve(true);
    throw new Error("Method not implemented.");
  }
  verifyHash(_plaintext: string, _hash: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  createCode(): string {
    throw new Error("Method not implemented.");
  }
}

// export default new MockCryptoService();
