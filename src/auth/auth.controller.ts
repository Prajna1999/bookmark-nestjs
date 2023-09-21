
import { Controller, Post, Body, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){
        
    }
    // POST /auth/signup
    @Post('signup')
    signup(@Body() dto:AuthDto){
        
        console.log({
            dto, 
        });
        
        return this.authService.signup(dto);
    }
    // POST /auth/login
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() dto:AuthDto){    
       
        return this.authService.login(dto);
    }
}