import { Role } from '@/user/entities/user.entity';
import { Reflector } from '@nestjs/core';

export const RBAC = Reflector.createDecorator<Role>();
