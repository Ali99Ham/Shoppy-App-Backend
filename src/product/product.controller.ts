import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt.guard.js';
import { NewProductDTO } from './dto/newProduct.dto.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { TokenPayload } from '../auth/token-payload.interface.js';
import { ProductService } from './product.service.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('new')
  @UseGuards(JWTAuthGuard)
  async createProduct(
    @Body() body: NewProductDTO,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productService.createProduct(body, user.userId);
  }

  @Get('all')
  @UseGuards(JWTAuthGuard)
  async getProducts() {
    return this.productService.getProducts();
  }
}
