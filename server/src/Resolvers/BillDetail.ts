import { Arg, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import Logger from '../Configs/Logger';
import BillDetail from '../Entities/BillDetail';
import Order from '../Entities/Order';
import OrderDetail from '../Entities/OrderDetail';
import Product from '../Entities/Product';
import { Authentication, Authorization } from '../Middlewares/Auth.middleware';
import BillDetailMutationResponse from '../Types/Mutations/BillDetailMutationResponse';

@Resolver((_of) => BillDetail)
export default class BillDetailResolver {
    @FieldResolver()
    async product(@Root() root: BillDetail): Promise<Product | null | undefined> {
        try {
            const product = await Product.findOne(root.productId);

            return product;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //create bill detail
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => BillDetailMutationResponse)
    async createBillDetail(
        @Arg('orderId') orderId: number,
        @Arg('billId') billId: number
    ): Promise<BillDetailMutationResponse> {
        try {
            const order = await Order.findOne(orderId);
            let billDetails: BillDetail[] = [];

            if (!order) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have no order with id: ' + orderId,
                };
            }

            const orderDetails = await OrderDetail.find({ orderId: order.id });

            if (!orderDetails || orderDetails.length === 0) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have no any item in order',
                };
            }

            for (let i = 0; i < orderDetails.length; i++) {
                const newBillDetail = await BillDetail.create({
                    productId: orderDetails[i].productId,
                    billId,
                    quantity: orderDetails[i].quantity,
                });

                await BillDetail.save(newBillDetail);

                billDetails.push(newBillDetail);
            }

            return {
                code: 201,
                success: true,
                message: 'Create bill detail successfully',
                billDetails,
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: `Server interval error: ${error.message}`,
            };
        }
    }
}
