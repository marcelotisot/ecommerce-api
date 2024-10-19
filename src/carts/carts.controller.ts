import { 
  Controller,
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe 
} from '@nestjs/common';

import { CartsService } from './carts.service';

// Dtos
import { CreateCartItemDto, UpdateCartItemDto } from './dto';

// Decoradores custom
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Auth()
  @Post('create')
  createCart( 
    @GetUser('id') userId: string, 
    @Body() createCartItemDto: CreateCartItemDto 
  ) {
    return this.cartsService.addItem( userId, createCartItemDto );
  }


  @Auth()
  @Patch('items/update/:cartItemId')
  updateItem(
    @GetUser('id') userId: string,
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto
  ) {
    return this.cartsService.updateItem( 
      userId, 
      cartItemId, 
      updateCartItemDto 
    );
  }

  @Auth()
  @Delete('items/remove/:cartItemId')
  removeItem(
    @GetUser('id') userId: string,
    @Param('cartItemId', ParseUUIDPipe) cartItemId: string
  ) {
    return this.cartsService.removeItem( userId, cartItemId );
  }

  @Auth()
  @Delete('empty/:cartId')
  removeAllItems( 
    @Param('cartId', ParseUUIDPipe) cartId: string 
  ) {
    return this.cartsService.removeAllItems( cartId );
  }

}
