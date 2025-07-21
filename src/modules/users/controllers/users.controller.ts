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
import { Auth } from '@modules/auth/decorators';
import { ValidRoles } from '@modules/auth/interfaces';

@Controller('users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}

  @Auth(ValidRoles.admin)
  @Get('all')
  findAllUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAllUsers(paginationDto);
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findUserById(id);
  }

  @Auth()
  @Patch('update/:id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Auth(ValidRoles.admin)
  @Delete('delete/:id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @Auth(ValidRoles.admin)
  @Patch('ban/:id')
  banUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.banUser(id);
  }

}
