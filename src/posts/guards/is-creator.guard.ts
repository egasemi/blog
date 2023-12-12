import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PostsService } from '../posts.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req.user.role === Role.ADMIN) return true;

    const post = await this.postsService.findOne(req.params.id);
    return post.author.toString() === req.user?._id;
  }
}
