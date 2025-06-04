import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete 
} from '@nestjs/common';

import { CartsService } from '../services/carts.service';
import { Auth, GetUser } from '../../../modules/auth/decorators';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @Auth() // Permitir acceso a cualquier usuario autenticado
  getCart( @GetUser('id') userId: string ) {
    return this.cartsService.getCartByUser(userId);
  }

  @Post('add')
  @Auth() // Permitir acceso a cualquier usuario autenticado
  addItem(@GetUser('id') userId: string, @Body() addToCartDto: AddToCartDto) {
    return this.cartsService.addItem(userId, addToCartDto);
  }

  @Delete('remove/:productId')
  @Auth() // Permitir acceso a cualquier usuario autenticado
  removeItem(@GetUser('id') userId: string, @Param('productId') productId: string) {
    return this.cartsService.removeItem(userId, productId);
  }

  @Delete('clear')
  @Auth() // Permitir acceso a cualquier usuario autenticado
  clearCart(@GetUser('id') userId: string) {
    return this.cartsService.clearCart(userId);
  }

}
