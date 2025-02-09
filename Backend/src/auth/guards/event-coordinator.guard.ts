import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class Event_CoordinatorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user && user.role === 'event-coordinator';
  }
}
