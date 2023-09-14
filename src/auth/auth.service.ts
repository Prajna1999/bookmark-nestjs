/* eslint-disable prettier/prettier */

import { ForbiddenException, Injectable } from "@nestjs/common";
// import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}
    async login(dto: AuthDto){
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            }
        });
        if (!user) throw new ForbiddenException('User not found');

        const pwMatches=await argon.verify(user.hash, dto.password);

        if(!pwMatches) throw new ForbiddenException('Wrong Password');

        delete user.hash;
        return user;
    }

    async signup(dto: AuthDto){
        const hash = await argon.hash(dto.password);
        // save the new user in the db
        try {
          const user = await this.prisma.user.create({
            data: {
              email: dto.email,
              hash,
            },
          });
    
        //   return this.signToken(user.id, user.email);
        return user;
        } catch (error) {
          if (
            error instanceof
            PrismaClientKnownRequestError
          ) {
           
              throw new ForbiddenException(
                'Credentials taken',
              );
            
          }
          throw error;
        }
        
    }
}