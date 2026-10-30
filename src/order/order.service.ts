import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductService } from '../product/product.service.js';
import { PAYMENT_STATUS } from './order.status.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductService,
  ) {}

  async createOrder(userId: number, productIds: number[]) {
    const products = await this.productService.getProductByIDs(productIds);
    if (products.length !== productIds.length) {
      throw new NotFoundException('Some products were not found');
    }
    const total = products.reduce(
      (sum, product) => sum.plus(product.price),
      new Prisma.Decimal(0),
    );

    return await this.prisma.order.create({
      data: {
        userId,
        total,
        orderItems: {
          create: products.map((product) => ({
            productId: product.id,
            quantity: 1,
            price: product.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async updateOrderStatus(id: number, status: PAYMENT_STATUS) {
    try {
      return await this.prisma.order.update({
        where: {
          id: id,
        },
        data: {
          status: status,
        },
      });
    } catch (e: any) {
      if (e.code === 'P2025') throw new NotFoundException('order not found');
      throw e;
    }
  }

  async updateStripeSessionId(orderId: number, sessionId: string) {
    return this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        stripeSessionId: sessionId,
      },
    });
  }
}
