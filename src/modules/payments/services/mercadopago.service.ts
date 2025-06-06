import { Injectable, Logger } from '@nestjs/common';
import * as mercadopago from 'mercadopago';
import { envs } from '../../../config';
import { OrdersService } from '../../../modules/orders/services/orders.service';
import { OrderStatus } from 'src/modules/orders/enums/order-status.enum';

@Injectable()
export class MercadopagoService {

  private readonly logger = new Logger('MercadopagoService');

  constructor(private readonly ordersService: OrdersService) {
    mercadopago.configure({
      access_token: envs.mercadopagoAccessToken
    });
  }

  /**
   * Crear orden de mercadopago basada en los items de la orden de compra enviada
   * @param order 
   * @returns 
   */
  async createOrder(order: any) {
    const preference = {
      items: order.items.map((item) => ({
        title: item.product.name,
        unit_price: Number(item.price),
        quantity: item.quantity,
        currency_id: 'ARS',
      })),
      payer: {
        name: order.customerName,
        email: order.customerEmail,
      },
      external_reference: order.id, // referencia a tu orden interna
      back_urls: {
        success: 'https://tusitio.com/pago-exitoso',
        failure: 'https://tusitio.com/pago-fallido',
        pending: 'https://tusitio.com/pago-pendiente',
      },
      auto_return: 'approved' as 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    return response.body;
  }

  async handlePaymentWebhook(paymentId: any) {
    const payment = await mercadopago.payment.findById(paymentId);
    const { status, external_reference } = payment.body;

    switch (status) {
      case 'approved':
        await this.ordersService.updateOrderStatus(external_reference, OrderStatus.paid);
        break;
      case 'pending':
        await this.ordersService.updateOrderStatus(external_reference, OrderStatus.pending);
        break;
      case 'rejected':
        await this.ordersService.updateOrderStatus(external_reference, OrderStatus.rejected);
        break;
      default:
        console.warn(`Estado no manejado: ${status}`);
    }
  }


}
