import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderService } from '../order/order.service.js';
import { PAYMENT_STATUS } from '../order/order.status.js';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: Stripe,
    private readonly orderService: OrderService,
    private readonly configService: ConfigService,
  ) {}

  async createCheckoutSession(userId: number, productIds: number[]) {
    const order = await this.orderService.createOrder(userId, productIds);
    const session = await this.stripe.checkout.sessions.create({
      metadata: {
        orderId: order.id.toString(),
      },
      line_items: order.orderItems.map((orderItem) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: orderItem.product.name,
          },
          unit_amount: orderItem.price.mul(100).toNumber(),
        },
        quantity: orderItem.quantity,
      })),
      mode: 'payment',
      success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL'),
    });
    await this.orderService.updateStripeSessionId(order.id, session.id);
    return session;
  }

  async handleCheckoutWebhook(event: any) {
    if (event.type !== 'checkout.session.completed') {
      return;
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== 'paid') {
      return;
    }
    const orderId = session.metadata?.orderId;
    if (!orderId) throw new Error('order id is missing in the order payment');

    return this.orderService.updateOrderStatus(
      Number(orderId),
      PAYMENT_STATUS.PAID,
    );
  }
}
