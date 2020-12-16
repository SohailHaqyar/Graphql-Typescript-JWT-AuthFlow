import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, ObjectIdColumn, Column } from "typeorm";
import { ObjectID } from "mongodb";
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column("text")
  email: string;

  @Column("text")
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;
}
