import { Field, ObjectType } from 'type-graphql';
import Product from '../Entities/Product';
import FieldError from './FieldError';
import MutationResponse from './MutationResponse';

@ObjectType({ implements: MutationResponse })
export default class ProductMutationResponse implements MutationResponse {
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field((_return) => Product, { nullable: true })
    product?: Product;

    @Field((_return) => [Product])
    products?: Product[];
}
