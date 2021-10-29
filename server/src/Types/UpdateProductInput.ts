import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateProductInput {
    @Field()
    id!: number;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    image?: string;

    @Field({ nullable: true })
    price?: number;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    categoryId?: number;
}
