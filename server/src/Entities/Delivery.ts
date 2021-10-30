import {
    Entity,
    BaseEntity,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import User from './User';
import Order from './Order';

@Entity()
@ObjectType()
export default class Delivery extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field((_return) => ID)
    id!: number;

    @Column()
    @Field()
    name!: string;

    @Column()
    @Field()
    phone!: string;

    @Column()
    @Field()
    address!: string;

    @Column({ nullable: true })
    userId!: number;

    @ManyToOne(() => User, (user) => user.delivery)
    @Field((_return) => User)
    user: User;

    @OneToMany(() => Order, (order) => order.delivery)
    @Field((_return) => [Order])
    orders: Order[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
