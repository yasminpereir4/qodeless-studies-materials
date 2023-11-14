import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Supplier } from "./supplier.entity";

@Entity()
@ObjectType()
export class ElectricMaterial extends BaseEntity {
  @Field()
  @Column("text", { unique: true })
  name: string;

  @Field(() => Int)
  @Column("integer")
  quantityInStock: number;

  @Field()
  @Column("uuid")
  supplierId: string;

  @Field(() => Supplier, { nullable: true })
  @ManyToOne(() => Supplier, supplier => supplier.electricMaterials, {
    onDelete: "CASCADE",
  })
  supplier: Supplier;
}
