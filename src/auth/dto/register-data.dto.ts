import { CreateUserDto } from 'src/users/dto/create-user.dto';

// Если данные для регистрации будут отличаться, то можно расширить UserRegisterDto
export class UserRegisterDto extends CreateUserDto {}
