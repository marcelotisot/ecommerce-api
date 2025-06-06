import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartItem } from '../entities';
import { Repository } from 'typeorm';
import { Product } from '../../../modules/products/entities/product.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  /**
   * Devuelve el carrito del usuario autenticado o crea uno nuevo
   * @param userId 
   * @returns Promise<Cart>
   */
  async getCartByUser(userId: string) {

    // Buscar el carrito y cargar relaciones
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product']
    });

    // Si no existe
    if (!cart) {

      // Creamos un nuevo carrito
      cart = await this.cartRepository.save({ 
        user: { id: userId }, 
        items: [] 
      });

    }

    return cart;

  }

  /**
   * Agregar productos al carrito y comprobar stock suficiente
   * Si ya existe el producto aumenta la cantidad
   * @param userId 
   * @param addToCartdto 
   * @returns Promise<CartItem
   */
  async addItem(userId: string, addToCartdto: AddToCartDto) {

    const { productId, quantity } = addToCartdto;

    // Obtenemos el carrito del usuario autenticado
    const cart = await this.getCartByUser(userId);

    // Obtenemos el producto que se va a agregar
    const product = await this.productRepository.findOne({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Buscar si el producto ya existe en el carrito del usuario
    let cartItem = await this.cartItemRepository.findOne({
      where: { 
        product: { id: product.id },
        cart: { id: cart.id}
      },
      relations: ['product', 'cart']
    });

    // Cantidad actual + cantidad que se quiere agregar
    const totalRequested = (cartItem?.quantity || 0) + quantity;

    // Comprobamos el stock
    if (product.stock < totalRequested ) {
      throw new BadRequestException('The product does not have sufficient stock');
    } 

    if (cartItem) {

      // Aumentamos la cantidad
      cartItem.quantity += quantity;
   
      return this.cartItemRepository.save(cartItem);

    } else {

      // Creamos un nuevo item
      cartItem = this.cartItemRepository.create({ product, quantity, cart });

      // Incrementamos el total de items en el carrito en 1
      await this.cartRepository.increment({id: cart.id}, 'totalItems', 1);

      return this.cartItemRepository.save(cartItem);

    }

  }

  /**
   * Elimina un producto/item del carrito
   * @param userId 
   * @param productId 
   * @returns Promise<Cart>
   */
  async removeItem(userId: string, productId: string) {

    // Obtenemos el carrito del usuario autenticado
    const cart = await this.getCartByUser(userId);

    // Buscamos el item validando con el ID del producto
    const item = cart.items.find(i => i.product.id === productId);

    if (item) {

      // Eliminamos el item
      await this.cartItemRepository.remove(item);

      // Reducimos el total de items en el carrito en 1
      await this.cartRepository.decrement({id: cart.id}, 'totalItems', 1);

    }

    // Devolvemos el carrito actualizado
    return this.getCartByUser(userId);

  }

  /**
   * Vaciar el carrito / eliminar todos los items
   * @param userId 
   * @returns Promise<Cart>
   */
  async clearCart(userId: string) {

    // Obtenemos el carrito del usuario autenticado
    const cart = await this.getCartByUser(userId);

    // Eliminamos todos los items del carrito
    await this.cartItemRepository.remove(cart.items);

    // Reiniciamos total de items en el carrito a 0
    await this.cartRepository.update(cart.id, { totalItems: 0 });

    // Devolvemos el carrito actualizado
    return this.getCartByUser(userId);

  }

}
