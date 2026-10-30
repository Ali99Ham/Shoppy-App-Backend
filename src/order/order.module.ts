import { Module } from '@nestjs/common';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ProductModule } from '../product/product.module.js';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [PrismaModule, ProductModule],
  exports: [OrderService],
})
export class OrderModule {}
