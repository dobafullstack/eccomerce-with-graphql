require('reflect-metadata');
require('dotenv').config();
import { COOKIES_NAME, __prod__ } from './Constants/constant';
import express from 'express';
import { createConnection } from 'typeorm';
import Logger from './Configs/Logger';
import Category from './Entities/Category';
import Product from './Entities/Product';
import User from './Entities/User';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Auth from './Resolvers/Auth';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
import { Context } from './Types/Context';
import CategoryResolver from './Resolvers/Category';
import ProductResolver from './Resolvers/Product';
import Role from './Entities/Role';
import RoleResolver from './Resolvers/Role';
import UserResolver from './Resolvers/User';
import Order from './Entities/Order';
import OrderDetail from './Entities/OrderDetail';
import Delivery from './Entities/Delivery';
import Bill from './Entities/Bill';
import BillDetail from './Entities/BillDetail';
import DeliveryResolver from './Resolvers/Delivery';
import OrderResolver from './Resolvers/Order';
import OrderDetailResolver from './Resolvers/OrderDetail';
import BillResolver from './Resolvers/Bill';
import BillDetailResolver from './Resolvers/BillDetail';
import path from 'path';
import cors from 'cors'

const main = async () => {
    const connection = await createConnection({
        type: 'postgres',
        ...(__prod__
            ? { url: process.env.DATABASE_URL }
            : {
                  database: 'clothes_shop',
                  username: process.env.DB_USERNAME,
                  password: process.env.DB_PASSWORD,
              }),
        logging: true,
        ...(__prod__ ? {
            extra: {
                ssl: {
                    rejectUnauthorized: false
                }
            },
            ssl: true
        }: {}),
        ...(__prod__ ? {} : { synchronize: true }),
        entities: [User, Category, Product, Role, Order, OrderDetail, Delivery, Bill, BillDetail],
        migrations: [path.join(__dirname, '/migrations/*')]
    });

    if (__prod__) await connection.runMigrations()

    const app = express();
    const PORT = process.env.PORT || 4000;

    // app.use(
    //     cors({
    //         origin: __prod__ ? '' : 'http://localhost:3000',
    //         credentials: true
    //     })
    // )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                Auth,
                CategoryResolver,
                ProductResolver,
                RoleResolver,
                UserResolver,
                DeliveryResolver,
                OrderResolver,
                OrderDetailResolver,
                BillResolver,
                BillDetailResolver,
            ],
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: ({ req, res }): Context => ({ req, res }),
    });

    //session
    const mongodb_url = process.env.MONGODB_URL as string;
    await mongoose.connect(mongodb_url);

    Logger.success('MongoDB is connected');

    app.use(
        session({
            name: COOKIES_NAME,
            store: MongoStore.create({ mongoUrl: mongodb_url }),
            cookie: {
                maxAge: 1000 * 60 * 5, //one hour
                httpOnly: true,
                secure: __prod__,
                sameSite: 'lax',
                domain: __prod__ ? '.vercel.app' : undefined
            },
            secret: process.env.SESSION_SECRET as string,
            saveUninitialized: false,
            resave: false,
        })
    );

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(PORT, () =>
        Logger.success(`Server is running on: http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
};

main().catch((err) => console.log(err));
