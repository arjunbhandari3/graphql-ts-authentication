import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { AuthResponse, LoginPayload, User, UserModel } from "../models/User";

@Resolver(() => AuthResponse)
export class AuthResolver {
  @Query(() => String)
  async hello() {
    return "Hello World";
  }

  @Mutation(() => AuthResponse)
  async login(@Arg("loginPayload") loginPayload: LoginPayload) {
    try {
      const { email, password } = loginPayload;
      const user = await UserModel.findOne({ email: email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return new Error("Invalid credentials");
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      return {
        user: user,
        token: `Bearer ${token}`,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => AuthResponse)
  async register(@Arg("registerPayload") registerPayload: User) {
    try {
      const { email, password, username } = registerPayload;
      const user = await UserModel.findOne({ email: email });
      if (user) return new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = {
        email: email,
        password: hashedPassword,
        username: username,
      };

      const createdUser = await UserModel.create(newUser);

      const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      return {
        user: createdUser,
        token: `Bearer ${token}`,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
