import { 
  BadRequestException, 
  Injectable,
  NotFoundException 
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart, CartItem } from './entities';

import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

import { CreateCartItemDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartsService {

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  /*
  * Devuelve un carrito existente o crea uno nuevo
  */
  async findOrcreateCart( userId: string ) {

    // Obtener el usuario autenticado
    const user = await this.usersService.findUserById( userId );

    // Verificar si el usuario ya tiene un carrito creado
    let cart = await this.cartRepository.findOne({
      where: { 
        user: { id: user.id } 
      }
    });

    if ( ! cart ) {
      // Creamos y asignamos el nuevo carro al usuario
      cart = this.cartRepository.create({ user, items: [] });
      await this.cartRepository.save( cart );
    }

    return cart;
    
  }

  /*
  * Agregar item / producto al carrito
  */
  async addItem( userId: string, createCartItemDto: CreateCartItemDto ) {
    
    // Obtener o crear el carrito
    const cart = await this.findOrcreateCart( userId );

    const { productId, quantity = 1 } = createCartItemDto;

    // Obtener el producto que se va a agregar
    const product = await this.productsService.findProductById( productId );

    // Verificar si ya fue agregado el producto al carrito
    const productExists = await this.cartItemRepository.findOne({
      where: { 
        product: {
          id: product.id
        } 
      }
    });

    if ( productExists )
      throw new BadRequestException( `El producto ya fue agregado al carrito` );

    const item = this.cartItemRepository.create({ 
      cart, product, quantity
    });

    return this.cartItemRepository.save( item );

  }

  async findCartById( id: string ) {
    const cart = await this.cartRepository.findOneBy({ id });

    if ( !cart )
      throw new NotFoundException( `Cart with id ${ id } not found` );

    return cart;
  }

  /*
  * Actualizar un item del carrito:
  * --------------------------------
  * Permite actualizar la cantidad
  */
  async updateItem (
     userId: string, 
     carItemId: string, 
     updateCartItemDto: UpdateCartItemDto 
  ) {

    const { quantity } = updateCartItemDto;

    const cart = await this.findOrcreateCart( userId );

    // Obtener el item
    const cartItem = cart.items.find(
      item => item.id === carItemId
    );

    if (!cartItem)
      throw new NotFoundException('Cart item not found');

    // Actualizar cantidad
    cartItem.quantity = quantity;

    await this.cartItemRepository.save(cartItem);

    return this.cartRepository.save(cart);

  }


  /*
  * Eliminar un item especifico del carrito
  */
  async removeItem( userId: string, cartItemId: string ) {
    // Obtener el carrito
    const cart = await this.findOrcreateCart( userId );

    // Obtener el indice a eliminar
    const index = cart.items.findIndex(
      item => item.id === cartItemId
    );

    if ( index === - 1 )
      throw new NotFoundException('Cart item not found');

    const [cartItem] = cart.items.splice(index, 1);
    await this.cartItemRepository.remove(cartItem);

    return this.cartRepository.save(cart);

  }

  /*
  * Eliminar todos los items / vaciar el carrito
  */
  async removeAllItems( cartId: string ) {
    const cart = await this.findCartById( cartId );

    for (const item of cart.items) {
      await this.cartItemRepository.remove(item);
    }
  }

}
