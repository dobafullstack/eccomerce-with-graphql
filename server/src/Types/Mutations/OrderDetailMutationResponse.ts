import { ObjectType } from "type-graphql";
import OrderDetail from "../../Entities/OrderDetail";
import FieldError from "../Interface/FieldError";
import MutationResponse from "../Interface/MutationResponse";

@ObjectType({implements: MutationResponse})
export default class OrderDetailMutationResponse implements MutationResponse{
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;
    orderDetail?: OrderDetail;
}