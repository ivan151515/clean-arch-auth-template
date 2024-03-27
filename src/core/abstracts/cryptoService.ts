export abstract class CryptoService {
  abstract hash(password: string): Promise<string>;
  abstract verifyHash(plaintext: string, hash: string): Promise<boolean>;
  abstract hashEmailCode(code: string): string;
  abstract createCode(): string;
  abstract generatePasswordResetToken(): string;
}
