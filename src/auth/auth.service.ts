/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
// import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}
    login(){
        return {msg:'I have logged in successfully'};
    }

    signup(){
        return {msg:'I have signed up'};
    }
}