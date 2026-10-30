import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller.js';
import { CheckoutService } from './checkout.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { ProductModule } from '../product/product.module.js';
import { OrderModule } from '../order/order.module.js';

@Module({
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) =>
        new Stripe(configService.getOrThrow('STRIPE_SECRET_KEY')),
      inject: [ConfigService],
    },
  ],
  imports: [ConfigModule, ProductModule, OrderModule],
})
export class CheckoutModule {}
