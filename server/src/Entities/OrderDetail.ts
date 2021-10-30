import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import Order from './Order';
import Product from './Product';

@ObjectType()
@Entity()
export default class OrderDetail extends BaseEntity {
    @Field((_return) => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    productId!: number;

    @Field((_return) => Product)
    @ManyToOne(() => Product, (product) => product.orderDetails)
    product: Product;

    @Column({ nullable: true })
    orderId!: number;

    @Field((_return) => Order)
    @ManyToOne(() => Order, (order) => order.orderDetails)
    order: Order;

    @Field()
    @Column()
    quantity!: number;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
