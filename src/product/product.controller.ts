import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
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

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '/public/product',
        filename: (req, file, callback) => {
          const uniqueName = `${req.params.productID}-${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  @Post(':productID/image')
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {}
}
