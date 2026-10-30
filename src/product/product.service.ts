import { Injectable, NotFoundException } from '@nestjs/common';
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
      return await this.prisma.product.findMany();
    } catch (e) {
      throw e;
    }
  }

  async uploadImage(imageUrl: string, productID: number) {
    console.log(imageUrl, productID);
    try {
      return await this.prisma.product.update({
        where: { id: productID },
        data: { imageUrl },
      });
    } catch (e) {
      throw e;
    }
  }

  async getProductByID(productID: number) {
    try {
      return await this.prisma.product.findUniqueOrThrow({
        where: {
          id: productID,
        },
      });
    } catch (e: any) {
      if (e.code === 'P2025') throw new NotFoundException('product not found');
      throw e;
    }
  }

  async getProductByIDs(ids: number[]) {
    return this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
