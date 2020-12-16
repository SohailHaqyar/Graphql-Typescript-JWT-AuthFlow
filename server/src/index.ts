import { config } from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { User } from "./entities/user.model";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { UserResolver } from "./resolvers";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./utils/sendRefreshToken";

const startServer = async () => {
  await createConnection({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "typeormTesting",
    useUnifiedTopology: true,
    entities: [User],
  });

  // Dotenv
  config();
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });

  const app = Express();
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies["jid"];
    if (!token) {
      res.send({ ok: false, accessToken: "" });
    }
    console.log(req.cookies);
    let payload;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      res.send({ ok: false, accessToken: "" });
    }
    const user = await User.findOne(payload.userId);
    if (!user) {
      res.send({ ok: false, accessToken: "" });
    }

    if (user?.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }
    sendRefreshToken(res, createRefreshToken(user!));
    res.send({ ok: true, accessToken: createAccessToken(user!) });
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ res, req }) => ({ res, req }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(4000, () => {
    console.log("server is on http://localhost:4000/graphql");
  });
};
startServer().catch((e) => console.log(e));
