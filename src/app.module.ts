import { Module } from '@nestjs/common';

// Modulos
import { DatabaseModule } from '@modules/database/database.module';

@Module({
  imports: [DatabaseModule]
})
export class AppModule {}
