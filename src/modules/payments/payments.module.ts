import { Module } from '@nestjs/common';
import { MercadopagoService } from './services/mercadopago.service';
import { MercadopagoController } from './controllers/mercadopago.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [MercadopagoController],
  providers: [MercadopagoService],
})
export class PaymentsModule {}
