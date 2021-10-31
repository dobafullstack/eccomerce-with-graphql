import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import Bill from './Bill';
import Product from './Product';

@ObjectType()
@Entity()
export default class BillDetail extends BaseEntity {
    @Field((_return) => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    productId!: number;

    @Field((_return) => Product)
    @OneToMany(() => Product, (product) => product.billDetails)
    product: Product;

    @Column()
    billId!: number;

    @ManyToOne(() => Bill, bill => bill.billDetails)
    bill: Bill

    @Field()
    @Column()
    quantity!: number;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;
}