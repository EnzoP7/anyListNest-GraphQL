import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';

import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs/login.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJtwToken(id: string) {
    return this.jwtService.sign({ id: id });
  }

  async singup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.userService.create(signupInput);

    const token = this.getJtwToken(user.id);

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.userService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Email / Password do not match');

    const token = this.getJtwToken(user.id);

    return { token, user };
  }


  async validateUser(id:string) : Promise<User>{
    const user = await this.userService.findOneById(id);

    if(!user.isActive){
      throw new UnauthorizedException("Account is inactive");
    }

    delete user.password;
    return user;

  }


   revalidateToken(user:User):AuthResponse{
    const token = this.getJtwToken(user.id);
    return{token,user}
  }
}
