import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateOrderInput {
    @Field()
    deliveryId!: number;

    @Field()
    status!: string;
}
