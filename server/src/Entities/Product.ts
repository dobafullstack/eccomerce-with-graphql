import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import BillDetail from './BillDetail';
import Category from './Category';
import OrderDetail from './OrderDetail';

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

    @Column({ nullable: true })
    categoryId!: number;

    @Field((_types) => Category)
    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
    orderDetails: OrderDetail[];

    @OneToMany(() => BillDetail, (billDetail) => billDetail.product)
    billDetails: BillDetail[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
