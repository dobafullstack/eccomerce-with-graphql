require('reflect-metadata');
require('dotenv').config();
import express from 'express';
import { createConnection } from 'typeorm';
import Logger from './Configs/Logger';
import Category from './Entities/Category';
import Product from './Entities/Product';
import User from './Entities/User';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Hello from './Resolvers/Hello';
import Auth from './Resolvers/Auth';

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
            resolvers: [Hello, Auth],
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(PORT, () => Logger.success(`Server is running on: http://localhost:${PORT}${apolloServer.graphqlPath}`));
};

main().catch((err) => console.log(err));
