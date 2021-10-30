import { COOKIES_NAME } from './../Constants/constant';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import Logger from '../Configs/Logger';
import User from '../Entities/User';
import RegisterInput from '../Types/InputTypes/RegisterInput';
import UserMutationResponse from '../Types/Mutations/UserMutationResponse';
import md5 from 'md5';
import { ValidateRegister } from '../Utils/Validation';
import LoginInput from '../Types/InputTypes/LoginInput';
import { Context } from '../Types/Context';
import Role from '../Entities/Role';
import { Authentication, Authorization } from '../Middlewares/Auth.middleware';

@Resolver()
export default class Auth {
    //Register
    @Mutation((_return) => UserMutationResponse)
    async Register(
        @Arg('registerInput') registerInput: RegisterInput
    ): Promise<UserMutationResponse> {
        const { username, email, password } = registerInput;
        const validate = ValidateRegister(registerInput);

        if (validate !== null) {
            return {
                ...validate,
            };
        }

        try {
            const existingUser = await User.findOne({
                where: [{ username }, { email }],
            });

            if (existingUser) {
                return {
                    code: 400,
                    message: 'Duplicate username or email',
                    success: false,
                    errors: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${
                                existingUser.username === username ? 'Username' : 'Email'
                            } already taken`,
                        },
                    ],
                };
            }

            const hashPassword = md5(password);
            const customer = await Role.findOne({name: 'customer'})

            const newUser = User.create({
                ...registerInput,
                password: hashPassword,
                roleId: customer?.id,
            });

            return {
                code: 201,
                success: true,
                message: 'Register successfully',
                user: await User.save(newUser),
            };
        } catch (error: any) {
            Logger.error(error.message);

            return {
                code: 500,
                success: false,
                message: `Interval server error ${error.message}`,
            };
        }
    }

    //Login
    @Mutation((_return) => UserMutationResponse)
    async Login(
        @Arg('loginInput') loginInput: LoginInput,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        const { usernameOrEmail, password } = loginInput;
        try {
            const existingUser = await User.findOne({
                where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
            });

            const hashPassword = md5(password);

            if (!existingUser || existingUser.password !== hashPassword) {
                return {
                    code: 400,
                    success: false,
                    message: 'Invalid username or email or password',
                };
            }

            req.session.userId = existingUser.id;

            return {
                code: 200,
                success: true,
                message: 'Login successfully',
                user: existingUser,
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: `Interval server error ${error.message}`,
            };
        }
    }

    //Logout
    @Mutation((_return) => Boolean)
    async Logout(@Ctx() { req, res }: Context): Promise<Boolean> {
        return new Promise((resolve, _reject) => {
            res.clearCookie(COOKIES_NAME);

            req.session.destroy((err) => {
                if (err) {
                    Logger.error(`DESTROYING SESSION ERROR ${err}`);
                    resolve(false);
                }

                resolve(true);
            });
        });
    }

    //Create Admin
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => UserMutationResponse)
    async createAdmin(
        @Arg('registerInput') registerInput: RegisterInput
    ): Promise<UserMutationResponse> {
        const { username, email, password } = registerInput;
        const validate = ValidateRegister(registerInput);

        if (validate !== null) {
            return {
                ...validate,
            };
        }

        try {
            const existingUser = await User.findOne({
                where: [{ username }, { email }],
            });

            if (existingUser) {
                return {
                    code: 400,
                    message: 'Duplicate username or email',
                    success: false,
                    errors: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${
                                existingUser.username === username ? 'Username' : 'Email'
                            } already taken`,
                        },
                    ],
                };
            }

            const hashPassword = md5(password);
            const admin = await Role.findOne({ name: 'admin' });

            const newUser = User.create({
                ...registerInput,
                password: hashPassword,
                roleId: admin?.id,
            });

            return {
                code: 201,
                success: true,
                message: 'Register successfully',
                user: await User.save(newUser),
            };
        } catch (error: any) {
            Logger.error(error.message);

            return {
                code: 500,
                success: false,
                message: `Interval server error ${error.message}`,
            };
        }
    }
    //Create Staff
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => UserMutationResponse)
    async createStaff(
        @Arg('registerInput') registerInput: RegisterInput
    ): Promise<UserMutationResponse> {
        const { username, email, password } = registerInput;
        const validate = ValidateRegister(registerInput);

        if (validate !== null) {
            return {
                ...validate,
            };
        }

        try {
            const existingUser = await User.findOne({
                where: [{ username }, { email }],
            });

            if (existingUser) {
                return {
                    code: 400,
                    message: 'Duplicate username or email',
                    success: false,
                    errors: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${
                                existingUser.username === username ? 'Username' : 'Email'
                            } already taken`,
                        },
                    ],
                };
            }

            const hashPassword = md5(password);
            const staff = await Role.findOne({ name: 'staff' });

            const newUser = User.create({
                ...registerInput,
                password: hashPassword,
                roleId: staff?.id,
            });

            return {
                code: 201,
                success: true,
                message: 'Register successfully',
                user: await User.save(newUser),
            };
        } catch (error: any) {
            Logger.error(error.message);

            return {
                code: 500,
                success: false,
                message: `Interval server error ${error.message}`,
            };
        }
    }
}
