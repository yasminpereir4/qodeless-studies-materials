import { Field, Int, InterfaceType } from "@nestjs/graphql";
import { Column } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@InterfaceType()
export abstract class MaterialBase extends BaseEntity {
  @Field()
  @Column("text", { unique: true })
  name: string;

  @Field(() => Int)
  @Column("integer")
  quantityInStock: number;

  @Field()
  @Column("uuid")
  supplierId: string;
}
