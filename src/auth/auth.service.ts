/* eslint-disable prettier/prettier */

import { ForbiddenException, Injectable } from "@nestjs/common";
// import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    async login(dto: AuthDto){
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
            }
        });
        if (!user) throw new ForbiddenException('User not found');

        const pwMatches=await argon.verify(user.hash, dto.password);

        if(!pwMatches) throw new ForbiddenException('Wrong Password');

        return this.signToken(user.id, user.email);
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
    
          return this.signToken(user.id, user.email);
        
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

    async signToken(userId: number, email: string): Promise<{access_token:string}> {
        const payload={
            sub:userId,
            email,
        }
        // return a token
        const token=await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET'),
        });
        return{
            access_token:token,
        }
    }
}