import { Field, ObjectType } from 'type-graphql';
import User from '../Entities/User';
import FieldError from './FieldError';

@ObjectType()
export default class UserMutationResponse {
    @Field()
    code!: number;

    @Field()
    success!: boolean;

    @Field()
    message!: string;

    @Field({nullable: true})
    user?: User;

    @Field((_types) => [FieldError], {nullable: true})
    errors?: FieldError[];
}
