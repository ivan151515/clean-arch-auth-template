import { CryptoService } from "../../core/abstracts/cryptoService";

export class MockCryptoService implements CryptoService {
  generatePasswordResetToken(): string {
    throw new Error("Method not implemented.");
  }
  hashEmailCode(code: string): string {
    throw new Error("Method not implemented.");
  }
  async hash(password: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  verifyHash(plaintext: string, hash: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  createCode(): string {
    throw new Error("Method not implemented.");
  }
}

// export default new MockCryptoService();
