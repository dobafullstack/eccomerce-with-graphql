import { Field, ObjectType } from 'type-graphql';
import BillDetail from '../../Entities/BillDetail';
import FieldError from '../Interface/FieldError';
import MutationResponse from '../Interface/MutationResponse';

@ObjectType({ implements: MutationResponse })
export default class BillDetailMutationResponse implements MutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field(_return => [BillDetail], { nullable: true })
    billDetails?: BillDetail[];
}
