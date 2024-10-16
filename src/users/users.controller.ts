import { 
  Controller, 
  Get, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe 
} from '@nestjs/common';

import { UsersService } from './users.service';
import { ChangePasswordDto, UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('find/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('change/password/:id')
  changePassword(@Param('id', ParseUUIDPipe) id: string, @Body() changePasswordDto :ChangePasswordDto ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
