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

  async getProducts(
    name?: string,
    price?: number,
    userId?: number,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where = {
        ...(name !== undefined && {
          name: { contains: name },
        }),
        ...(price !== undefined && { price }),
        ...(userId !== undefined && { userId }),
        ...(price !== undefined && { price }),
      };

      return await this.prisma.product.findMany({
        where,
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
      });
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
