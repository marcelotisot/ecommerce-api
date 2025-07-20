import { 
  Controller, 
  Get, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe, 
  Query
} from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '@common/dto/pagination.dto';

@Controller('users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  findAllUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAllUsers(paginationDto);
  }

  @Get(':id')
  findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findUserById(id);
  }

  @Patch('update/:id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @Patch('ban/:id')
  banUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.banUser(id);
  }

}
