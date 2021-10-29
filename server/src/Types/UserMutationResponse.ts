import { Field, ObjectType } from 'type-graphql';
import User from '../Entities/User';
import FieldError from './FieldError';
import IMutationResponse from './MutationResponse';

@ObjectType({ implements: IMutationResponse })
export default class UserMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field({ nullable: true })
    user?: User;
}
