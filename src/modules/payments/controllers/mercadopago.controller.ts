import { Controller, Get, HttpStatus, Logger, Param, ParseUUIDPipe, Post, Req, Res } from '@nestjs/common';
import { MercadopagoService } from '../services/mercadopago.service';
import { OrdersService } from '../../../modules/orders/services/orders.service';
import { Request, Response } from 'express';

@Controller('mercadopago')
export class MercadopagoController {

  constructor(
    private readonly mercadoPagoService: MercadopagoService,
    private readonly ordersService: OrdersService
  ) {}

  /**
   * Finalizar compra, generar orden de mercadopago y retornar init_point (Url para pagar)
   * @param orderId 
   * @returns preference.init_point
   */
  @Get('checkout/:orderId')
  async checkout(@Param('orderId', ParseUUIDPipe) orderId: string) {
    const order      = await this.ordersService.findById(orderId);
    const preference = await this.mercadoPagoService.createOrder(order);

    return {
      init_point: preference.init_point,
    };
  }

  @Post('webhook')
  async mercadopagoWebhook(@Req() req: Request, @Res() res: Response) {
    const body = req.body;

    try {
      const paymentId = body?.data?.id;

      if (body.type === 'payment' && paymentId) {
        await this.mercadoPagoService.handlePaymentWebhook(paymentId);
      }

      res.status(HttpStatus.OK).send('Webhook recibido');
    } catch (error) {
      console.error('Error manejando webhook:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error en el servidor');
    }
  }

}
