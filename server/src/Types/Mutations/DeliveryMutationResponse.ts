import { Field, ObjectType } from 'type-graphql';
import Delivery from '../../Entities/Delivery';
import FieldError from '../Interface/FieldError';
import MutationResponse from '../Interface/MutationResponse';

@ObjectType({ implements: MutationResponse })
export default class DeliveryMutationResponse implements MutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field((_return) => Delivery, { nullable: true })
    delivery?: Delivery;
}
