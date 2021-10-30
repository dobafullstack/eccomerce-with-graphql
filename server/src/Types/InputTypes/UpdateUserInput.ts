import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateUserInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    address?: string;
}
