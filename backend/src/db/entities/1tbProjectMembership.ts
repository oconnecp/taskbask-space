import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, Index
} from "typeorm";
import { TBUser } from "./1tbUser";
import { TBProject } from "./1tbProject";

export enum ProjectRole {
  OWNER = "OWNER",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER", 
}

@Entity({ name: "tb_project_memberships" })
@Unique("u_member_per_project", ["projectId", "userId"])
export class TBProjectMembership {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ name: "project_id", type: "uuid" })
  projectId!: string;

  @ManyToOne(() => TBProject, { onDelete: "CASCADE" })
  project!: TBProject;

  @Index()
  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => TBUser, { onDelete: "CASCADE" })
  user!: TBUser;

  @Index()
  @Column({
    type: "enum",
    enum: ProjectRole,
    default: ProjectRole.EDITOR
  })
  role!: ProjectRole;
}
