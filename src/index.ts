import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

import { AuthResolver } from "./resolvers/AuthResolver";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

async function bootstrap() {
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AuthResolver],
      validate: true,
    }),
    playground: true,
    context: ({ req, res }) => ({ req, res }),
  });

  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  server.applyMiddleware({ app, cors: false });

  app.listen({ port: PORT }, () => {
    console.log(`Server is running, GraphQL Playground available at ${PORT}`);
  });
}

bootstrap();
