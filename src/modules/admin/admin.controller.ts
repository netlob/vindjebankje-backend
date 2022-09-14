import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JWT } from '../../decorators/jwt.decorator';
import { FirebaseAdminAuthGuard } from '../../guards/auth.guard';

@UseGuards(FirebaseAdminAuthGuard)
@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
