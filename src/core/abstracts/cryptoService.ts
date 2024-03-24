export abstract class CryptoService {
  abstract hash(password: string): string;
  abstract verifyHash(plaintext: string, hash: string): Promise<boolean>;
  abstract createCode(): string;
}
