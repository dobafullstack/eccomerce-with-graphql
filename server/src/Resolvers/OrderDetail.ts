import { Mutation, Resolver, Arg, UseMiddleware, FieldResolver, Root } from 'type-graphql';
import Logger from '../Configs/Logger';
import OrderDetail from '../Entities/OrderDetail';
import Product from '../Entities/Product';
import { Authentication, Authorization } from '../Middlewares/Auth.middleware';
import CreateOrderDetailInput from '../Types/InputTypes/CreateOrderDetailInput';
import UpdateOrderDetailInput from '../Types/InputTypes/UpdateOrderDetailInput';
import OrderDetailMutationResponse from '../Types/Mutations/OrderDetailMutationResponse';
import _ from 'lodash';

@Resolver((_of) => OrderDetail)
export default class OrderDetailResolver {
    @FieldResolver()
    async product(@Root() root: OrderDetail): Promise<Product | null | undefined> {
        try {
            const product = await Product.findOne(root.productId);

            return product;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //create order detail
    @UseMiddleware(Authentication)
    @Mutation((_return) => OrderDetailMutationResponse)
    async createOrderDetail(
        @Arg('createOrderDetailInput') createOrderDetailInput: CreateOrderDetailInput
    ): Promise<OrderDetailMutationResponse> {
        try {
            const newOrderDetail = await OrderDetail.create(createOrderDetailInput);

            return {
                code: 201,
                success: true,
                message: 'Create order detail successfully',
                orderDetail: await OrderDetail.save(newOrderDetail),
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

    //update order detail
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => OrderDetailMutationResponse)
    async updateOrderDetail(
        @Arg('id') id: number,
        @Arg('updateOrderDetailInput') updateOrderDetailInput: UpdateOrderDetailInput
    ): Promise<OrderDetailMutationResponse> {
        try {
            const existingOrderDetail = await OrderDetail.findOne(id);

            if (!existingOrderDetail) {
                return {
                    code: 403,
                    success: false,
                    message: 'Have no any order detail with id: ' + id,
                };
            }

            _.extend(existingOrderDetail, updateOrderDetailInput);
            await existingOrderDetail.save();

            return {
                code: 200,
                success: true,
                message: 'Update order detail successfully',
                orderDetail: existingOrderDetail,
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

    //delete order detail
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => OrderDetailMutationResponse)
    async deleteOrderDetail(@Arg('id') id: number): Promise<OrderDetailMutationResponse> {
        try {
            const existingOrderDetail = await OrderDetail.findOne(id);

            if (!existingOrderDetail) {
                return {
                    code: 403,
                    success: false,
                    message: 'Have no any order detail with id: ' + id,
                };
            }

            await OrderDetail.delete(id);

            return {
                code: 200,
                success: true,
                message: 'Delete order detail successfully',
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
