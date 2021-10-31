import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateOrderDetailInput {
    @Field()
    productId!: number;

    @Field()
    quantity!: number;
}
