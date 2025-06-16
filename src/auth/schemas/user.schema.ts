import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import * as bcrypt from "bcrypt";

export type UserDocument = HydratedDocument<User> & {};

@Schema({ collection: 'auth_users' })
export class User {

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ['user'], enum: ['USER', 'ORGANIZER', 'ADMIN'] })
  roles: string[];

  @Prop({ default: () => new Date() })
  registrationDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Middleware para hashear la contraseña antes de guardar
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});
