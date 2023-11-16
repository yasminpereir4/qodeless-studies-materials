import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, ManyToOne } from "typeorm";
import { MaterialBase } from "./MaterialBase";
import { Supplier } from "./supplier.entity";

@Entity()
@ObjectType()
export class ChemicalMaterial extends MaterialBase {
  @Field(() => Supplier, { nullable: true })
  @ManyToOne(() => Supplier, supplier => supplier.chemicalMaterials, {
    onDelete: "CASCADE",
  })
  supplier: Supplier;
}
