import { Field, InputType } from "type-graphql";

@InputType()
export default class CreateOrderDetailInput{
    @Field()
    productId!: number;

    @Field()
    orderId!: number;

    @Field()
    quantity!: number;
}