import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateProductInput {
    @Field()
    name!: string;

    @Field()
    image!: string;

    @Field()
    price!: number;

    @Field({ nullable: true })
    description?: string;

    @Field()
    categoryId!: number;
}
