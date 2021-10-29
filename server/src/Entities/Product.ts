import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Category from './Category';

@ObjectType()
@Entity()
export default class Product extends BaseEntity {
    @Field((_types) => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    image!: string;

    @Field()
    @Column()
    price: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    description?: string;

    @Column({nullable: true})
    categoryId!: number;

    @Field((_types) => Category)
    @ManyToOne(() => Category, (category) => category.products)
    category: Category;
}
