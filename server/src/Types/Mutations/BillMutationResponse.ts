import { Field, ObjectType } from 'type-graphql';
import Bill from '../../Entities/Bill';
import FieldError from '../Interface/FieldError';
import MutationResponse from '../Interface/MutationResponse';

@ObjectType({ implements: MutationResponse })
export default class BillMutationResponse implements MutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field((_return) => Bill, { nullable: true })
    bill?: Bill;
}
