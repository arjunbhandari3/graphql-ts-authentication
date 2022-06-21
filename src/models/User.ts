import { Field, InputType, ObjectType } from "type-graphql";
import { getModelForClass, mongoose, prop } from "@typegoose/typegoose";

@ObjectType()
@InputType("userInput")
export class User {
  @prop()
  @Field({ nullable: true })
  username: string;

  @prop()
  @Field({ nullable: true })
  password: string;

  @prop()
  @Field({ nullable: true })
  email: string;
}

@InputType("loginPayload")
export class LoginPayload {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType("AuthResponse")
export class AuthResponse {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}

export const UserModel: mongoose.Model<any> = getModelForClass(User);
