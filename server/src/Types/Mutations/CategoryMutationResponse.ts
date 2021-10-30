import { Field, ObjectType } from "type-graphql";
import Category from "../../Entities/Category";
import FieldError from "../Interface/FieldError";
import MutationResponse from "../Interface/MutationResponse";


@ObjectType({implements: MutationResponse})
export default class CategoryMutationResponse implements MutationResponse{
    code: number;
    success: boolean;
    message: string;
    errors?: FieldError[] | undefined;

    @Field(_return => Category, {nullable: true})
    category?: Category;
}