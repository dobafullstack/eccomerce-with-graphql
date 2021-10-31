import { Field, InputType } from 'type-graphql';

@InputType()
export default class UpdateOrderInput {
    @Field()
    deliveryId!: number;

    @Field()
    status!: string;
}
