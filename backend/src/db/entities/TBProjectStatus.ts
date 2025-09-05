  import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, Unique
} from "typeorm";
import { TBProject } from "./tbProject";

@Entity({ name: "project_statuses" })
@Unique("u_project_status_name", ["projectId", "name"])
@Unique("u_project_status_order", ["projectId", "order"])
export class TBProjectStatus {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ name: "project_id", type: "uuid" })
  projectId!: string;

  @ManyToOne(() => TBProject, { onDelete: "CASCADE" })
  project!: TBProject;

  // e.g. "To-Do", "In Progress", "Complete"
  @Column({ type: "varchar", length: 80 })
  name!: string;

  // display order (0,1,2...)
  @Column({ type: "int" })
  order!: number;
}
