import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItem } from '../entities';
import { Repository } from 'typeorm';
import { CartsService } from '../../../modules/carts/services/carts.service';
import { PaginatedResult, PaginationDto } from '../../../common';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrdersService {

  private readonly logger = new Logger('OrdersService');
  
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly cartsService: CartsService,
  ) {}


  /**
   * Crear orden de compra basada en el carrito actual
   * @param userId 
   * @returns Promise<Order>
   */
  async checkout(userId: string): Promise<Order> {

    const cart = await this.cartsService.getCartByUser(userId);

    if (!cart.items.length) {
      throw new BadRequestException('The cart is empty');
    }

    const items = cart.items.map((item) =>
      this.orderItemRepository.create({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      }),
    );

    // Calculamos el total
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    console.log('[DEBUG] cart.user: ', cart.user);

    const order = this.orderRepository.create({
      user: cart.user,
      items,
      total,
    });

    await this.cartsService.clearCart(userId);

    return this.orderRepository.save(order);

  }

  /**
   * Listado de órdenes paginadas
   * @param paginationDto 
   * @returns Promise<PaginatedResult<Order>>
   */
  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Order>> {

    const { page = 1, limit = 10} = paginationDto;
    
    const skip = ( page - 1 ) * limit;

    const [orders, total] = await this.orderRepository.findAndCount({

      skip,
      take: limit,
      order: {
        createdAt: 'DESC'
      },
      relations: { items: true, user: true }
      
    });

    const lastPage = Math.ceil( total / limit );

    return {
      data: orders,

      meta: {
        total: total,
        per_page: Number(limit),
        current_page: Number(page),
        last_page: lastPage
      }
    }

  }

  async findById(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  /**
   * Actualiza el estado de la orden segun el estado recibido
   * por el webhook de mercadopago
   * @param orderId 
   * @param status 
   */
  async updateOrderStatus(orderId: any, status: string) {

    const order = await this.findById(orderId);

    const validStatuses = {
      paid: OrderStatus.paid,
      pending: OrderStatus.pending,
      rejected: OrderStatus.rejected,
    };

    if (status in validStatuses) {

      this.logger.log(`Estado recibido:`, status);

      await this.orderRepository.update(order.id, {
        status: validStatuses[status as keyof typeof validStatuses],
      });
      
    }

  }

}
