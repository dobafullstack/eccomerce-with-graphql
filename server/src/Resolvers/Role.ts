import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import Logger from '../Configs/Logger';
import Role from '../Entities/Role';
import User from '../Entities/User';
import CreateRoleInput from '../Types/InputTypes/CreateRoleInput';
import RoleMutationResponse from '../Types/Mutations/RoleMutationResponse';
import updateRoleInput from '../Types/InputTypes/UpdateRoleInput';
import _ from 'lodash';
import { Authentication, Strict } from '../Middlewares/Auth.middleware';


@Resolver((_of) => Role)
export default class RoleResolver {
    @FieldResolver()
    async users(@Root() root: Role): Promise<User[]> {
        const users = await User.find({ roleId: root.id });

        return users;
    }

    //create role
    @UseMiddleware(Authentication)
    @UseMiddleware(Strict)
    @Mutation((_return) => RoleMutationResponse)
    async createRole(
        @Arg('createRoleInput') createRoleInput: CreateRoleInput
    ): Promise<RoleMutationResponse> {
        const { name } = createRoleInput;

        try {
            const existingRole = await Role.findOne({ name });

            if (existingRole) {
                return {
                    code: 400,
                    success: false,
                    message: 'Role already exist',
                    errors: [{ field: 'name', message: 'Duplicate name' }],
                };
            }

            const newRole = Role.create({ name });

            return {
                code: 201,
                success: true,
                message: 'Create role successfully',
                role: await Role.save(newRole),
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error: ' + error.message,
            };
        }
    }

    //get list roles
    @UseMiddleware(Authentication)
    @UseMiddleware(Strict)
    @Query((_return) => [Role])
    async getRoles(): Promise<Role[] | null> {
        try {
            const roles = await Role.find();

            return roles;
        } catch (error: any) {
            Logger.error(error.message);

            return null;
        }
    }

    //get detail role
    @UseMiddleware(Authentication)
    @UseMiddleware(Strict)
    @Query((_return) => Role, { nullable: true })
    async getRole(@Arg('id') id: number): Promise<Role | null | undefined> {
        try {
            const role = await Role.findOne(id);

            return role;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //update role
    @UseMiddleware(Authentication)
    @UseMiddleware(Strict)
    @Mutation((_return) => RoleMutationResponse)
    async updateRole(
        @Arg('updateRoleInput') updateRoleInput: updateRoleInput
    ): Promise<RoleMutationResponse> {
        try {
            const existingRole = await Role.findOne(updateRoleInput.id);

            if (!existingRole) {
                return {
                    code: 400,
                    success: false,
                    message: 'Do not have any role with id: ' + updateRoleInput.id,
                };
            }

            _.extend(existingRole, updateRoleInput);
            await existingRole.save();

            return {
                code: 200,
                success: true,
                message: 'Update role successfully',
                role: existingRole,
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error: ' + error.message,
            };
        }
    }

    //delete role
    @UseMiddleware(Authentication)
    @UseMiddleware(Strict)
    @Mutation((_return) => RoleMutationResponse)
    async deleteRole(@Arg('id') id: number): Promise<RoleMutationResponse> {
        try {
            const existingRole = await Role.findOne(id);

            if (!existingRole) {
                return {
                    code: 400,
                    success: false,
                    message: 'Do not have any role with id: ' + id,
                };
            }

            await Role.delete(existingRole);

            return {
                code: 200,
                success: true,
                message: 'Delete role successfully',
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error: ' + error.message,
            };
        }
    }
}
