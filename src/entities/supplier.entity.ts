import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ChemicalMaterial } from "./chemical-material.entity";
import { ElectricMaterial } from "./electric-material.entity";
import { HydraulicMaterial } from "./hydraulic-material.entity";

@Entity()
@ObjectType()
export class Supplier extends BaseEntity {
  @Field()
  @Column("text", { unique: true })
  name: string;

  @Field(() => [ElectricMaterial], { nullable: true })
  @OneToMany(
    () => ElectricMaterial,
    electricMaterial => electricMaterial.supplier,
    {
      onDelete: "CASCADE",
    },
  )
  electricMaterials: ElectricMaterial[];

  @Field(() => [HydraulicMaterial], { nullable: true })
  @OneToMany(
    () => HydraulicMaterial,
    hydraulicMaterial => hydraulicMaterial.supplier,
    {
      onDelete: "CASCADE",
    },
  )
  hydraulicMaterials: HydraulicMaterial[];

  @Field(() => [ChemicalMaterial], { nullable: true })
  @OneToMany(
    () => ChemicalMaterial,
    chemicalMaterial => chemicalMaterial.supplier,
    {
      onDelete: "CASCADE",
    },
  )
  chemicalMaterials: ChemicalMaterial[];
}
