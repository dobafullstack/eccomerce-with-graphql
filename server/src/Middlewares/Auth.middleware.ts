import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';
import { ADMIN_ROLE, CUSTOMER_ROLE } from '../Constants/constant';
import Role from '../Entities/Role';
import User from '../Entities/User';
import { Context } from '../Types/Context';

export const Authentication: MiddlewareFn<Context> = ({ context: { req } }, next) => {
    if (!req.session.userId) {
        throw new AuthenticationError('Not authenticated to perform GraphQL operations');
    }

    return next();
};

export const Authorization: MiddlewareFn<Context> = async ({context: {req}}, next) => {
    const user = await User.findOne(req.session.userId);

    if (user){
        const role = await Role.findOne(user.roleId);

        if (role && role.name === CUSTOMER_ROLE){
            throw new AuthenticationError("You do not have permission to access this route");
        }
    }
    
    return next();
}
export const Strict: MiddlewareFn<Context> = async ({context: {req}}, next) => {
    const user = await User.findOne(req.session.userId);

    if (user){
        const role = await Role.findOne(user.roleId);

        if (role && role.name !== ADMIN_ROLE){
            throw new AuthenticationError("You do not have permission to access this route");
        }
    }
    
    return next();
}
