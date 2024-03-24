import { CryptoService } from "../../core/abstracts/cryptoService";

export class MockCryptoService implements CryptoService {
  hash(password: string): string {
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
