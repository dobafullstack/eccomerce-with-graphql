import { Field, InterfaceType } from "type-graphql";
import FieldError from "./FieldError";


@InterfaceType()
export default abstract class IMutationResponse{
    @Field()
    code!: number;

    @Field()
    success!: boolean;

    @Field()
    message!: string;

    @Field((_types) => [FieldError], { nullable: true })
    errors?: FieldError[];
}