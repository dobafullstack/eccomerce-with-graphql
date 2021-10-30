import { OneToMany } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
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
import Role from './Role';
import Delivery from './Delivery';
import Bill from './Bill';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    username!: string;

    @Column()
    password!: string;

    @Field()
    @Column()
    email!: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    roleId!: number;

    @Field((_return) => Role)
    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    @Field((_return) => [Order])
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @Field((_return) => [Delivery])
    @OneToMany(() => Delivery, (delivery) => delivery.user)
    delivery: Delivery[];

    @Field((_return) => [Bill])
    @OneToMany(() => Bill, (bill) => bill.user)
    bills: Bill[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
