import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import Logger from '../Configs/Logger';
import User from '../Entities/User';
import RegisterInput from '../Types/RegisterInput';
import UserMutationResponse from '../Types/UserMutationResponse';
import md5 from 'md5';
import { ValidateRegister } from '../Utils/Validation';
import LoginInput from '../Types/LoginInput';
import { Context } from '../Types/Context';

@Resolver()
export default class Auth {
    //Get User
    @Query((_return) => User, { nullable: true })
    async GetUser(@Ctx() { req }: Context): Promise<User | null | undefined> {
        if (!req.session.userId) return null;

        return await User.findOne({ id: req.session.userId });
    }

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

            const newUser = User.create({
                ...registerInput,
                password: hashPassword,
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
}
