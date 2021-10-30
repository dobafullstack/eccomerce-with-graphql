import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './User';

@ObjectType()
@Entity()
export default class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field((_return) => ID)
    id!: number;

    @Column()
    @Field()
    name!: string;

    @Field((_return) => [User], { nullable: true })
    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
