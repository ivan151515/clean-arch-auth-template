export class UserEntity {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly id: number,
    public readonly emailVerificationCode: string | null,
    public readonly emailVerified: boolean,
    public readonly passwordResetToken: string | null,
    public readonly passwordResetTokenExpiresAt: Date | null
  ) {}
}
