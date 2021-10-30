import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import Logger from '../Configs/Logger';
import Delivery from '../Entities/Delivery';
import { Authentication } from '../Middlewares/Auth.middleware';
import { Context } from '../Types/Context';
import CreateDeliveryInput from '../Types/InputTypes/CreateDeliveryInput';
import UpdateDeliveryInput from '../Types/InputTypes/UpdateDeliveryInput';
import DeliveryMutationResponse from '../Types/Mutations/DeliveryMutationResponse';
import _ from 'lodash';

@Resolver()
export default class DeliveryResolver {
    //create delivery
    @UseMiddleware(Authentication)
    @Mutation((_return) => DeliveryMutationResponse)
    async createMyDelivery(
        @Arg('createDeliveryInput') createDeliveryInput: CreateDeliveryInput,
        @Ctx() { req }: Context
    ): Promise<DeliveryMutationResponse> {
        const { address } = createDeliveryInput;
        try {
            const existingDelivery = await Delivery.findOne({ address });

            if (existingDelivery) {
                return {
                    code: 400,
                    success: false,
                    message: 'Address already exist',
                    errors: [{ field: 'address', message: 'Duplicate address' }],
                };
            }

            const newDelivery = Delivery.create({
                ...createDeliveryInput,
                userId: req.session.userId,
            });

            return {
                code: 201,
                success: true,
                message: 'Create delivery successfully',
                delivery: await Delivery.save(newDelivery),
            };
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error: ' + error.message,
            };
        }
    }

    //get list delivery
    @UseMiddleware(Authentication)
    @Query((_return) => [Delivery])
    async getMyDeliveries(@Ctx() { req }: Context): Promise<Delivery[] | null> {
        try {
            const deliveries = await Delivery.find({ userId: req.session.userId });

            return deliveries;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //update delivery
    @UseMiddleware(Authentication)
    @Mutation((_return) => DeliveryMutationResponse)
    async updateMyDelivery(
        @Arg('updateDeliveryInput') updateDeliveryInput: UpdateDeliveryInput,
        @Ctx() {req}: Context
    ): Promise<DeliveryMutationResponse> {
        try {
            const existingDelivery = await Delivery.findOne();

            if (!existingDelivery) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have no delivery with id: ' + updateDeliveryInput.id,
                };
            }

            if (existingDelivery.userId !== req.session.userId){
                return{
                    code: 401,
                    success: false,
                    message: "You do not have permission to change it"
                }
            }

            _.extend(existingDelivery, updateDeliveryInput);

            await existingDelivery.save()

            return {
                code: 200,
                success: true,
                message: "Update delivery successfully"
            }
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error: ' + error.message,
            };
        }
    }
    //delete delivery
    @UseMiddleware(Authentication)
    @Mutation((_return) => DeliveryMutationResponse)
    async deleteMyDelivery(
        @Ctx() {req}: Context
    ): Promise<DeliveryMutationResponse> {
        try {
            const existingDelivery = await Delivery.findOne();

            if (!existingDelivery) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have no delivery with id: ' + req.session.userId,
                };
            }

            if (existingDelivery.userId !== req.session.userId){
                return{
                    code: 401,
                    success: false,
                    message: "You do not have permission to delete it"
                }
            }

            await Delivery.delete(req.session.userId);

            return {
                code: 200,
                success: true,
                message: "Delete delivery successfully"
            }
        } catch (error: any) {
            Logger.error(error.message);
            return {
                code: 500,
                success: false,
                message: 'Server interval error: ' + error.message,
            };
        }
    }
}
