import { compare, hash } from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../auth";
import { MyContext } from "../types/MyContext";
import {
  Resolver,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
  Ctx,
  UseMiddleware,
  // Int,
} from "type-graphql";
import { User } from "../entities/user.model";
import { isAuth } from "../middlewares/isAuth";
import { sendRefreshToken } from "../utils/sendRefreshToken";
// import { getConnection } from "typeorm";

@InputType()
class EmailPassInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class LoginResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
  success: boolean;
}

/**
 * Eventualy Another Class for Errors
 **/

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    const users = await User.find({});
    return users;
  }
  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  // It needs authentication
  async me(@Ctx() { payload }: MyContext): Promise<UserResponse> {
    try {
      const user = await User.findOne(payload?.userId);
      if (!user) {
        throw new Error("User not found brah");
      }
      return { user, success: true };
    } catch (e) {
      console.log(e);
      return { success: false };
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  hello(@Ctx() { payload }: MyContext) {
    return "Hello There Your Id is " + payload?.userId;
  }
  // @Mutation(() => Boolean)
  // async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
  //   await getConnection()
  //     .getRepository(User)
  //     .increment({ id: userId as any }, "tokenVersion", 1);
  //   return true;
  // }

  @Mutation(() => UserResponse!) //  1
  async register(
    @Arg("options") options: EmailPassInput
  ): Promise<UserResponse> {
    // Let's query for that user first;
    const possibleUser = await User.findOne({ email: options.email });
    if (possibleUser !== undefined) {
      return {
        errors: [{ field: "email", message: "Email Already In Use" }],
        success: false,
      };
    }

    const hashedPassword = await hash(options.password, 12);
    const newUser = User.create({
      email: options.email,
      password: hashedPassword,
    });

    return { user: await newUser.save(), success: true };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("options") options: EmailPassInput,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    // Let's query for that user first;
    const user = await User.findOne({ email: options.email });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "User Probably Doesn't exist",
          },
        ],
      };
    }

    const valid = await compare(options.password, user.password);
    if (!valid) {
      return {
        errors: [{ field: "password", message: "Invalid Password" }],
      };
    }
    sendRefreshToken(res, createRefreshToken(user));
    return {
      accessToken: createAccessToken(user),
    };
  }
}
