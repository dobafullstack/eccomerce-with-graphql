import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateCategoryInput {
    @Field()
    id!: number;

    @Field()
    name!: string;
}
