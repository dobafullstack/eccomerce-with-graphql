import { Field, ObjectType } from 'type-graphql';
import Role from '../../Entities/Role';
import FieldError from '../Interface/FieldError';
import MutationResponse from '../Interface/MutationResponse';

@ObjectType({ implements: MutationResponse })
export default class RoleMutationResponse implements MutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field((_return) => [Role], { nullable: true })
    roles?: Role[];

    @Field((_return) => Role, { nullable: true })
    role?: Role;
}
