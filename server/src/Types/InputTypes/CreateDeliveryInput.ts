import { Field, InputType } from 'type-graphql';

@InputType()
export default class CreateDeliveryInput {
    @Field()
    name!: string;

    @Field()
    phone!: string;

    @Field()
    address!: string;
}
