import { Authentication, Authorization } from './../Middlewares/Auth.middleware';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import Bill from '../Entities/Bill';
import BillMutationResponse from '../Types/Mutations/BillMutationResponse';
import Logger from '../Configs/Logger';
import { Context } from '../Types/Context';
import User from '../Entities/User';
import BillDetail from '../Entities/BillDetail';
import Order from '../Entities/Order';

@Resolver((_of) => Bill)
export default class BillResolver {
    @FieldResolver()
    async user(@Root() root: Bill): Promise<User | null | undefined> {
        try {
            const user = await User.findOne(root.userId);

            return user;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }
    @FieldResolver()
    async billDetails(@Root() root: Bill): Promise<BillDetail[] | null> {
        try {
            const billDetails = await BillDetail.find({
                billId: root.id
            });

            return billDetails;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //create bill
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Mutation((_return) => BillMutationResponse)
    async createBill(
        @Arg('orderId') orderId: number
    ): Promise<BillMutationResponse> {
        try {
            const order = await Order.findOne(orderId);

            if (!order){
                return {
                    code: 400, 
                    success: false,
                    message: "Have no order with id: " + orderId
                }
            }

            const newBill = await Bill.create({
                userId: order.userId
            })

            return {
                code: 201,
                success: true,
                message: "Create bill successfully",
                bill: await Bill.save(newBill)
            }
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: `Server interval error: ${error.message}`,
            };
        }
    }

    //get list bills (for manager)
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Query((_return) => [Bill], { nullable: true })
    async getBills(): Promise<Bill[] | null> {
        try {
            const bills = await Bill.find();

            return bills;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get list bills (for customer)
    @UseMiddleware(Authentication)
    @Query((_return) => [Bill], { nullable: true })
    async getMyBills(@Ctx() { req }: Context): Promise<Bill[] | null> {
        try {
            const bills = await Bill.find({ userId: req.session.userId });

            return bills;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get detail bill (for manager)
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Query((_return) => Bill, { nullable: true })
    async getBill(@Arg('id') id: number): Promise<Bill | null | undefined> {
        try {
            const bill = await Bill.findOne(id);

            return bill;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //get detail bill (for customer)
    @UseMiddleware(Authentication)
    @UseMiddleware(Authorization)
    @Query((_return) => Bill, { nullable: true })
    async getMyBill(
        @Arg('id') id: number,
        @Ctx() { req }: Context
    ): Promise<Bill | null | undefined> {
        try {
            const bill = await Bill.findOne({
                id,
                userId: req.session.userId,
            });

            return bill;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }
}
