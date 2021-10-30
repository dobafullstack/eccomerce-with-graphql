import { Field, InputType } from 'type-graphql';

@InputType()
export default class updateRoleInput {
    @Field()
    id!: number;

    @Field({ nullable: true })
    name?: string;
}
