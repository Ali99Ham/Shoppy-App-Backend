import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt.guard.js';
import { NewProductDTO } from './dto/newProduct.dto.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { TokenPayload } from '../auth/token-payload.interface.js';
import { ProductService } from './product.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilterProductDTO } from './dto/filterProduct.dto.js';

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
  async getProducts(@Query() query: FilterProductDTO) {
    const { name, price, userId, page, limit } = query;
    return this.productService.getProducts(name, price, userId, page, limit);
  }

  @Post(':productID/image')
  @UseGuards(JWTAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/product',
        filename: (req, file, callback) => {
          const uniqueName = `${req.params.productID}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png)$/,
            skipMagicNumbersValidation: true, // Bypass buffer check since diskStorage is used
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('productID', ParseIntPipe) productID: number,
  ) {
    const imageUrl = `/product/${file.filename}`;
    return this.productService.uploadImage(imageUrl, productID);
  }

  @Get(':productID')
  @UseGuards(JWTAuthGuard)
  async getProductByID(@Param('productID', ParseIntPipe) productID: number) {
    return this.productService.getProductByID(productID);
  }
}
