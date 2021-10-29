import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import Logger from '../Configs/Logger';
import Product from '../Entities/Product';
import CreateProductInput from '../Types/CreateProductInput';
import ProductMutationResponse from '../Types/ProductMutationResponse';
import _ from 'lodash';
import UpdateProductInput from '../Types/UpdateProductInput';
import Category from '../Entities/Category';

@Resolver(_of => Product)
export default class ProductResolver {
    @FieldResolver(_return => Category)
    async category(@Root() root: Product){
        return await Category.findOne(root.categoryId)
    }

    @Mutation((_return) => ProductMutationResponse)
    async createProduct(
        @Arg('createProductInput') createProductInput: CreateProductInput
    ): Promise<ProductMutationResponse> {
        try {
            const existingProduct = await Product.findOne({ name: createProductInput.name });

            if (existingProduct) {
                return {
                    code: 400,
                    success: false,
                    message: 'Product already exist',
                    errors: [{ field: 'name', message: 'Duplicate product name' }],
                };
            }

            const newProduct = Product.create(createProductInput);

            return {
                code: 201,
                success: true,
                message: 'Create product successfully',
                product: await Product.save(newProduct),
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

    //Get list Products
    @Query((_return) => [Product], { nullable: true })
    async getProducts(): Promise<Product[] | null> {
        try {
            const products = await Product.find();

            return _.orderBy(products, (product) => product.id);
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //Get detail product
    @Query((_return) => Product, { nullable: true })
    async getProduct(@Arg('id') id: number): Promise<Product | null | undefined> {
        try {
            const product = await Product.findOne(id);

            return product;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //Update product
    @Mutation((_return) => ProductMutationResponse)
    async updateProduct(
        @Arg('updateCategoryInput') updateProductInput: UpdateProductInput
    ): Promise<ProductMutationResponse> {
        const { id } = updateProductInput;
        try {
            const existingProduct = await Product.findOne(id);

            if (!existingProduct) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have no product with id: ' + id,
                };
            }

            _.extend(existingProduct, {
                ...updateProductInput
            });

            await existingProduct.save();

            return {
                code: 200,
                success: true,
                message: 'Update product successfully',
                product: existingProduct,
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

    @Mutation((_return) => ProductMutationResponse)
    async deleteProduct(@Arg('id') id: number): Promise<ProductMutationResponse> {
        try {
            const existingProduct = await Product.findOne(id);

            if (!existingProduct) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have no product with id: ' + id,
                };
            }

            await Product.delete(existingProduct);

            return {
                code: 200,
                success: true,
                message: 'Delete product successfully',
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
