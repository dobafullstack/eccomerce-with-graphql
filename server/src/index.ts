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

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'clothes_shop',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [User, Category, Product],
    });

    const app = express();
    const PORT = process.env.PORT || 4000;

    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [Auth, CategoryResolver, ProductResolver],
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: ({ req, res }): Context => ({ req, res }),
    });
    
    //session
    const mongodb_url = process.env.MONGODB_URL as string;
    await mongoose.connect(mongodb_url);

    Logger.success("MongoDB is connected");

    app.use(
        session({
            name: COOKIES_NAME,
            store: MongoStore.create({ mongoUrl: mongodb_url }),
            cookie: {
                maxAge: 1000 * 60, //one hour
                httpOnly: true,
                secure: __prod__,
                sameSite: "lax",
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
