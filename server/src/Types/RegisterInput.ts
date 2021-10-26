import { Field, InputType } from 'type-graphql';

@InputType()
export default class RegisterInput {
    @Field()
    name!: string;

    @Field()
    username!: string;

    @Field()
    password!: string;

    @Field()
    email!: string;

    @Field()
    phone: string;

    @Field()
    address: string;
}
