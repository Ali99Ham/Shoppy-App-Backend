import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { ProductService } from '../product/product.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: Stripe,
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
  ) {}

  async createCheckoutSession(productId: number) {
    const product = await this.productService.getProductByID(productId);
    if (product) {
      return await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: product.name,
              },
              unit_amount: product.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: this.configService.getOrThrow('STRIPE_SCCUSSE_URL'),
        cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL'),
      });
    } else throw new NotFoundException('product not found');
  }
}
