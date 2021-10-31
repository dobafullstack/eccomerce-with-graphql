import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import Logger from '../Configs/Logger';
import Order from '../Entities/Order';
import { Authentication, Authorization } from '../Middlewares/Auth.middleware';
import { Context } from '../Types/Context';
import CreateOrderInput from '../Types/InputTypes/CreateOrderInput';
import UpdateOrderInput from '../Types/InputTypes/UpdateOrderInput';
import OrderMutationResponse from '../Types/Mutations/OrderMutationResponse';
import _ from 'lodash';
import User from '../Entities/User';
import Delivery from '../Entities/Delivery';
import OrderDetail from '../Entities/OrderDetail';

@Resolver((_of) => Order)
export default class OrderResolver {
    @FieldResolver()
    async user(@Root() root: Order): Promise<User | null | undefined> {
        try {
            const user = await User.findOne(root.userId);

            return user;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    @FieldResolver()
    async delivery(@Root() root: Order): Promise<Delivery | null | undefined> {
        try {
            const delivery = await Delivery.findOne(root.deliveryId);

            return delivery;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    @FieldResolver()
    async orderDetails(@Root() root: Order): Promise<OrderDetail[] | null>{
        try {
            const orderDetails = await OrderDetail.find({orderId: root.id});

            return orderDetails;
        } catch (error: any) {
            Logger.error(error.message);
            return null
        }
    }

    //Create order
    @UseMiddleware(Authentication)
    @Mutation((_return) => OrderMutationResponse)
    async createOrder(
        @Arg('createOrderInput') createOrderInput: CreateOrderInput,
        @Ctx() {req}: Context
    ): Promise<OrderMutationResponse> {
        try {
            const newOrder = Order.create({
                ...createOrderInput,
                userId: req.session.userId
            });

            return {
                code: 201,
                success: true,
                message: 'Create order successfully',
                order: await Order.save(newOrder),
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error ' + error.message,
            };
        }
    }

    //get list orders (for manager)
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Query((_return) => [Order], { nullable: true })
    async getOrders(): Promise<Order[] | null> {
        try {
            const orders = await Order.find();

            return orders;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get list orders (for customer)
    @UseMiddleware(Authentication)
    @Query((_return) => [Order], { nullable: true })
    async getMyOrders(@Ctx() { req }: Context): Promise<Order[] | null> {
        try {
            const orders = await Order.find({ userId: req.session.userId });

            return orders;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get detail an order (for manager)
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Query((_return) => Order, { nullable: true })
    async getOrder(@Arg('id') id: number): Promise<Order | null | undefined> {
        try {
            const order = await Order.findOne(id);

            return order;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get detail an order (for customer)
    @UseMiddleware(Authentication)
    @Query((_return) => Order, { nullable: true })
    async getMyOrder(
        @Arg('id') id: number,
        @Ctx() { req }: Context
    ): Promise<Order | null | undefined> {
        try {
            const order = await Order.findOne({
                id,
                userId: req.session.userId,
            });

            return order;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //update order (for manager)
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => OrderMutationResponse)
    async updateOrder(
        @Arg('id') id: number,
        @Arg('updateOrderInput') updateOrderInput: UpdateOrderInput
    ): Promise<OrderMutationResponse> {
        try {
            const existingOrder = await Order.findOne(id);

            if (!existingOrder) {
                return {
                    code: 403,
                    success: false,
                    message: 'Have no order with id: ' + id,
                };
            }

            _.extend(existingOrder, updateOrderInput);

            await existingOrder.save();

            return {
                code: 200,
                success: true,
                message: 'Update order successfully',
                order: existingOrder,
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error ' + error.message,
            };
        }
    }

    //update order (for customer)
    @UseMiddleware(Authentication)
    @Mutation((_return) => OrderMutationResponse)
    async updateMyOrder(
        @Arg('updateOrderInput') updateOrderInput: UpdateOrderInput,
        @Ctx() { req }: Context
    ): Promise<OrderMutationResponse> {
        try {
            const existingOrder = await Order.findOne(req.session.userId);

            if (!existingOrder) {
                return {
                    code: 403,
                    success: false,
                    message: 'Have no order with id: ' + req.session.userId,
                };
            }

            _.extend(existingOrder, updateOrderInput);

            await existingOrder.save();

            return {
                code: 200,
                success: true,
                message: 'Update order successfully',
                order: existingOrder,
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error ' + error.message,
            };
        }
    }
}
