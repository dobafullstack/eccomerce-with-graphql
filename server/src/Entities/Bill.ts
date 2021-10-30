import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import BillDetail from "./BillDetail";
import User from "./User";

@Entity()
@ObjectType()
export default class Bill extends BaseEntity{
    @Field(_return => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({nullable: true})
    userId!: number;

    @ManyToOne(() => User, user => user.bills)
    @Field(_return => User)
    user: User;

    @OneToMany(() => BillDetail, billDetail => billDetail.bill)
    @Field(_return => [BillDetail])
    billDetails: BillDetail[];

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;
}