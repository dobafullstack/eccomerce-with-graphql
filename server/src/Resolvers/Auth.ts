import { Arg, Mutation, Resolver } from 'type-graphql';
import Logger from '../Configs/Logger';
import User from '../Entities/User';
import RegisterInput from '../Types/RegisterInput';
import UserMutationResponse from '../Types/UserMutationResponse';
import md5 from 'md5';

@Resolver()
export default class Auth {
    @Mutation(_return => UserMutationResponse)
    async Register(@Arg('registerInput') registerInput: RegisterInput): Promise<UserMutationResponse> {
        const { username, email, password } = registerInput;

        try {
            const existingUser = await User.findOne({
                where: [{ username }, { email }]
            });

            if (existingUser){
                return {
                    code: 400,
                    message: "Duplicate username or email",
                    success: false,
                    errors: [
                        {
                            field: existingUser.username === username ? 'username' : 'email',
                            message: `${existingUser.username === username ? "Username" : "Email"} already taken`
                        }
                    ]
                }
            }

            const hashPassword = md5(password);

            const newUser = User.create({
                ...registerInput,
                password: hashPassword
            });

            return {
                code: 201,
                success: true,
                message: "Register successfully",
                user: await User.save(newUser)
            }
        } catch (error: any) {
            Logger.error(error.message);

            return {
                code: 500,
                success: false,
                message: "Interval server error"
            }
        }
    }
}
