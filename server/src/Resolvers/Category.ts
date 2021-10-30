import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import Logger from '../Configs/Logger';
import Category from '../Entities/Category';
import CategoryMutationResponse from '../Types/Mutations/CategoryMutationResponse';
import _ from 'lodash';
import UpdateCategoryInput from '../Types/InputTypes/UpdateCategoryInput';
import Product from '../Entities/Product';
import { Authentication } from '../Middlewares/Auth.middleware';

@Resolver((_of) => Category)
export default class CategoryResolver {
    @FieldResolver()
    async products(@Root() root: Category): Promise<Product[]> {
        const products = Product.find({ categoryId: root.id });

        return products;
    }

    //Create Category
    @UseMiddleware(Authentication)
    @Mutation((_return) => CategoryMutationResponse)
    async createCategory(@Arg('name') name: string): Promise<CategoryMutationResponse> {
        try {
            const existingCategory = await Category.findOne({ name });

            if (existingCategory) {
                return {
                    code: 400,
                    success: false,
                    message: "Duplicate category's name",
                    errors: [{ field: 'name', message: "Category's name must be unique" }],
                };
            }

            const newCategory = Category.create({ name });

            return {
                code: 201,
                success: true,
                message: 'Create category successfully!',
                category: await Category.save(newCategory),
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

    //Get list Categories
    @Query((_return) => [Category], { nullable: true })
    async getCategories(): Promise<Category[] | null> {
        try {
            const categories = await Category.find();

            return _.orderBy(categories, (category) => category.id);
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //Get detail category
    @Query((_return) => Category, { nullable: true })
    async getCategory(@Arg('id') id: number): Promise<Category | null | undefined> {
        try {
            const category = await Category.findOne(id);

            return category;
        } catch (error: any) {
            Logger.error(error.message);
            return null;
        }
    }

    //Update category
    @UseMiddleware(Authentication)
    @Mutation((_return) => CategoryMutationResponse)
    async updateCategory(
        @Arg('updateCategoryInput') updateCategoryInput: UpdateCategoryInput
    ): Promise<CategoryMutationResponse> {
        const { id, name } = updateCategoryInput;
        try {
            const existingCategory = await Category.findOne(id);

            if (!existingCategory) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have no category with id: ' + id,
                };
            }

            _.extend(existingCategory, {
                name,
            });

            await existingCategory.save();

            return {
                code: 200,
                success: true,
                message: 'Update category successfully',
                category: existingCategory,
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

    //Delete Category
    @UseMiddleware(Authentication)
    @Mutation((_return) => CategoryMutationResponse)
    async deleteCategory(@Arg('id') id: number): Promise<CategoryMutationResponse> {
        try {
            const existingCategory = await Category.findOne(id);
            const products = await Product.find({ categoryId: id });

            if (!existingCategory) {
                return {
                    code: 400,
                    success: false,
                    message: 'Have no category with id: ' + id,
                };
            }

            products.forEach(async (product) => await Product.delete(product));
            await Category.delete(existingCategory);

            return {
                code: 200,
                success: true,
                message: 'Delete category successfully',
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
