import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req.user.role === Role.ADMIN) return true;

    const user = await this.usersService.findOne(req.params.id);

    return user._id.toString() === req.user?._id;
  }
}
