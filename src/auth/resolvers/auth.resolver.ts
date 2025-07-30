import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from '../dtos/access-token.dto';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Mutation(() => AccessTokenDto)
  async getAccessTokenByRefreshToken(
    @Args('refreshToken', { type: () => String }) refreshToken: string,
  ): Promise<AccessTokenDto> {
    const userId = await this.authService.getUserIdByRefreshToken({
      refreshToken,
    });

    const accessToken = this.jwtService.sign({ sub: userId });

    const newRefreshToken = await this.authService.createRefreshToken({
      userId,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  @Query(() => String)
  healthCheck(): string {
    return 'OK';
  }
}
