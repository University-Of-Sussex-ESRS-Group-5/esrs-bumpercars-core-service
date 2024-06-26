import { EntityRepository, Repository } from 'typeorm';
import { ResetToken } from '../entities/reset-token.entity';

@EntityRepository(ResetToken)
export class ResetTokenRepository extends Repository<ResetToken> {
  // Add methods to handle reset tokens here

  // Example: Method to find a reset token by its value
  public async findByToken(token: string): Promise<ResetToken | undefined> {
    const resetToken = await this.findOne({ where: { token } });
    return resetToken ?? undefined;
  }
  

  // Example: Method to invalidate a reset token
  public async invalidateToken(token: string): Promise<void> {
    const resetToken = await this.findByToken(token);
    if (resetToken) {
      resetToken.isValid = false; // Assuming there is an 'isValid' flag in the ResetToken entity
      await this.save(resetToken);
    }
  }
}
