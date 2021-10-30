import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import User from './User';
import Delivery from './Delivery';
import OrderDetail from './OrderDetail';

@ObjectType()
@Entity()
export default class Order extends BaseEntity {
    @Field((_return) => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    //user
    @Column({nullable: true})
    userId!: number;

    @Field(_return => User)
    @ManyToOne(() => User, user => user.orders)
    user: User;

    //delivery
    @Column({nullable: true})
    deliveryId!: number;

    @Field(_return => Delivery)
    @ManyToOne(() => Delivery, delivery => delivery.orders)
    delivery: Delivery;

    //order detail
    @Field(_return => [OrderDetail])
    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
    orderDetails: OrderDetail[]

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}