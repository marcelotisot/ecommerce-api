import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { ProductsModule } from 'src/products/products.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    ProductsModule,
    ConfigModule
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
