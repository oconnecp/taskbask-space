import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, Index,
  JoinColumn
} from "typeorm";
import { TBUser } from "./tbUser";
import { TBProject } from "./tbProject";

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
  @JoinColumn({ name: "project_id" })
  project!: TBProject;

  @Index()
  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => TBUser, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: TBUser;

  @Index()
  @Column({
    type: "enum",
    enum: ProjectRole,
    default: ProjectRole.EDITOR
  })
  role!: ProjectRole;
}
