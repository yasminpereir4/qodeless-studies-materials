import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToOne } from "typeorm";
import { MaterialBase } from "./MaterialBase";
import { Supplier } from "./supplier.entity";

@Entity()
@ObjectType()
export class ElectricMaterial extends MaterialBase {
  @Field(() => Supplier, { nullable: true })
  @ManyToOne(() => Supplier, supplier => supplier.electricMaterials, {
    onDelete: "CASCADE",
  })
  supplier: Supplier;
}
