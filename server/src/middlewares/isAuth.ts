import { MyContext } from "src/types/MyContext";
import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("Not Authenticated Pal");
  }
  try {
    console.log(process.env.ACCESS_TOKEN_SECRET);
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
    console.log(payload);
  } catch (e) {
    throw new Error("Not Authenticated Pal");
  }
  return next();
};
