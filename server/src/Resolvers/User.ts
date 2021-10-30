import {
    Arg,
    Ctx,
    Field,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
    FieldResolver,
    Root,
} from 'type-graphql';
import Logger from '../Configs/Logger';
import User from '../Entities/User';
import { Authentication, Authorization } from '../Middlewares/Auth.middleware';
import { Context } from '../Types/Context';
import UpdateUserInput from '../Types/InputTypes/UpdateUserInput';
import UserMutationResponse from '../Types/Mutations/UserMutationResponse';
import _ from 'lodash';
import Role from '../Entities/Role';

@Resolver((_of) => User)
export default class UserResolver {
    @FieldResolver()
    async role(@Root() root: User): Promise<Role | null | undefined> {
        try {
            const role = await Role.findOne(root.roleId);

            return role;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get list user
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Query((_return) => [User], { nullable: true })
    async getUsers(): Promise<User[] | null> {
        try {
            const users = await User.find();

            return users;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get user by id
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Query((_return) => User, { nullable: true })
    async getUser(@Arg('id') id: number): Promise<User | null | undefined> {
        try {
            const user = await User.findOne(id);

            return user;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get user by sessionId
    @UseMiddleware(Authentication)
    @Query((_return) => User, { nullable: true })
    async getMyUser(@Ctx() { req }: Context): Promise<User | null | undefined> {
        try {
            const user = await User.findOne(req.session.userId);

            return user;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //update user (for manager)
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => UserMutationResponse)
    async updateUser(
        @Arg('id') id: number,
        @Arg('updateUserInput') updateUserInput: UpdateUserInput
    ): Promise<UserMutationResponse> {
        try {
            const existingUser = await User.findOne(id);

            if (!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have not any user with id ' + id,
                };
            }

            _.extend(existingUser, updateUserInput);
            await existingUser.save();

            return {
                code: 200,
                success: true,
                message: 'Update user successfully',
                user: existingUser,
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error ' + error.message,
            };
        }
    }

    //update user (for customer)
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => UserMutationResponse)
    async updateMyUser(
        @Ctx() { req }: Context,
        @Arg('updateUserInput') updateUserInput: UpdateUserInput
    ): Promise<UserMutationResponse> {
        try {
            const existingUser = await User.findOne(req.session.userId);

            if (!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have not any user with id ' + req.session.userId,
                };
            }

            _.extend(existingUser, updateUserInput);
            await existingUser.save();

            return {
                code: 200,
                success: true,
                message: 'Update user successfully',
                user: existingUser,
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error ' + error.message,
            };
        }
    }

    //delete user
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => UserMutationResponse)
    async deleteUser(
        @Arg('id') id: number,
        @Ctx() { req }: Context
    ): Promise<UserMutationResponse> {
        if (id === req.session.userId) {
            return {
                code: 400,
                success: false,
                message: 'You can not delete yourself',
            };
        }

        try {
            const existingUser = await User.findOne(id);

            if (!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have not any user with id ' + id,
                };
            }

            await User.delete(id);

            return {
                code: 200,
                success: true,
                message: 'Delete user successfully',
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error ' + error.message,
            };
        }
    }
}
