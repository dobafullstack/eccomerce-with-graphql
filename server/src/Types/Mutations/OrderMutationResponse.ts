import { Field, ObjectType } from 'type-graphql';
import Order from '../../Entities/Order';
import FieldError from '../Interface/FieldError';
import MutationResponse from '../Interface/MutationResponse';

@ObjectType({ implements: MutationResponse })
export default class OrderMutationResponse implements MutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field((_return) => Order, { nullable: true })
    order?: Order;
}
