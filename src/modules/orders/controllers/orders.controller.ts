import { Controller, Get, Post, Query} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { Auth, GetUser } from '../../../modules/auth/decorators';
import { PaginationDto } from '../../../common';
import { ValidRoles } from '../../../modules/auth/interfaces';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @Auth()
  checkout(@GetUser('id') userId: string) {
    return this.ordersService.checkout(userId);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

}
