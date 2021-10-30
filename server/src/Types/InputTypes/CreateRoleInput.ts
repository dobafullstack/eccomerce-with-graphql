import { Field, InputType } from "type-graphql";

@InputType()
export default class CreateRoleInput{
    @Field()
    name!: string;
}