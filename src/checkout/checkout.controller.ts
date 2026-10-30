import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt.guard.js';
import { CreateCheckoutSessionDTO } from './dto/createSession.dto.js';
import { CheckoutService } from './checkout.service.js';
import Stripe from 'stripe';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { type TokenPayload } from '../auth/token-payload.interface.js';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('session')
  @UseGuards(JWTAuthGuard)
  async createCheckoutSession(
    @Body() request: CreateCheckoutSessionDTO,
    @CurrentUser() user: TokenPayload,
  ): Promise<Stripe.Checkout.Session> {
    return this.checkoutService.createCheckoutSession(
      user.userId,
      request.productIds,
    );
  }

  @Post('webhook')
  async handleCheckoutWebhook(@Body() event: any) {
    return this.checkoutService.handleCheckoutWebhook(event);
  }
}
