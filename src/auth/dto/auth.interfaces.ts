import { SetPasswordDto, SignInDto, SignUpDto } from './auth.dto';

export interface ISignUp extends SignUpDto {}

export interface ISetPassword extends SetPasswordDto {}

export interface ISignIn extends SignInDto {}
