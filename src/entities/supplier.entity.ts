import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { ElectricMaterial } from "./electric-material.entity";

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
}
