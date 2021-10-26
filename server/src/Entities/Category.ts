import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Product from "./Product";


@ObjectType()
@Entity()
export default class Category extends BaseEntity{
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;

    @Field(_types => [Product])
    @OneToMany(() => Product, product => product.category)
    products: Product[]
}