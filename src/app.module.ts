import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module.js';
import { ProductModule } from './product/product.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CheckoutModule } from './checkout/checkout.module.js';
import { OrderModule } from './order/order.module.js';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ProductModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public/product'),
      serveRoot: '/product',
    }),
    CheckoutModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
