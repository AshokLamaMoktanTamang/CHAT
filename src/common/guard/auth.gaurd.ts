import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    
    return user;
  }
}
