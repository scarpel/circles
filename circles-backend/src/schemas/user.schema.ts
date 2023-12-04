import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hashPassword } from '@utils/password';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;
}

export type TUserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }

  done();
});

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id;

    delete ret._id;
    delete ret.password;
    delete ret.__v;
  },
});
