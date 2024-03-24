export class UserEntity {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly id: number,
    public readonly emailVerificationCode: string,
    public readonly emailVerified: boolean
  ) {}
}
