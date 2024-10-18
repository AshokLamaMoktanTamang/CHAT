import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { FRIEND_STATUS } from '@/utils/constants';

@Schema({ timestamps: true })
export class Friend extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  requester: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: FRIEND_STATUS,
    default: FRIEND_STATUS.PENDING,
  })
  status: string;

  @Prop({ type: Date, default: null })
  acceptedAt?: Date;

  @Prop({ type: Date, default: null })
  blockedAt?: Date;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
