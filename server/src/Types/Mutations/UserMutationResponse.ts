import { Field, ObjectType } from 'type-graphql';
import User from '../../Entities/User';
import FieldError from '../Interface/FieldError';
import IMutationResponse from '../Interface/MutationResponse';

@ObjectType({ implements: IMutationResponse })
export default class UserMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field({ nullable: true })
    user?: User;
}
