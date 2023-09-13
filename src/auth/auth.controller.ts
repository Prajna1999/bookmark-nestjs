
import { Controller, Post, Body} from '@nestjs/common';
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
        
        return this.authService.signup();
    }
    // POST /auth/login
    @Post('login')
    login(){    
        return this.authService.login();
    }
}