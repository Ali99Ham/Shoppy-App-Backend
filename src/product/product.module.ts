import { Module } from '@nestjs/common';
import { ProductController } from './product.controller.js';
import { ProductService } from './product.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProductGateway } from './product.gateway.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ProductController],
  providers: [ProductService, ProductGateway],
  exports: [ProductService],
})
export class ProductModule {}
