import { Injectable } from '@nestjs/common';
import { NewProductDTO } from './dto/newProduct.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(body: NewProductDTO, userId: number) {
    try {
      return await this.prisma.product.create({
        data: { ...body, userId },
      });
    } catch (e) {}
  }

  async getProducts() {
    try {
      return this.prisma.product.findMany();
    } catch (e) {}
  }
}
