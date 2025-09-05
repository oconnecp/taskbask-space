import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index,
  CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { TBProject } from "./1tbProject";
import { TBUser } from "./1tbUser";
import { TBProjectStatus } from "./1tbProjectStatus";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

@Entity({ name: "tasks" })
export class TBTask {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ name: "project_id", type: "uuid" })
  projectId!: string;

  @ManyToOne(() => TBProject, { onDelete: "CASCADE" })
  project!: TBProject;

  // Nullable assignee; if user deleted, keep history -> set null
  @Index()
  @Column({ name: "assignee_id", type: "uuid", nullable: true })
  assigneeId!: string | null;

  @ManyToOne(() => TBUser, { onDelete: "SET NULL" })
  assignee!: TBUser | null;

  // enforce valid status by referencing project_statuses
  @Index()
  @Column({ name: "status_id", type: "uuid" })
  statusId!: string;

  @ManyToOne(() => TBProjectStatus, { onDelete: "RESTRICT" })
  status!: TBProjectStatus;

  @Column({ type: "varchar", length: 180 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Index()
  @Column({ name: "due_date", type: "timestamptz", nullable: true })
  dueDate!: Date | null;

  @Index()
  @Column({
    type: "enum",
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  priority!: TaskPriority;

  //This is not ideal.  in the future we will probably soft delete users for this reason alone
  @Index()
  @Column({ name: "created_by_id", type: "uuid", nullable: true })
  createdById!: string | null;

  @ManyToOne(() => TBUser, { onDelete: "SET NULL" })
  createdBy!: TBUser | null;

  @CreateDateColumn({ name: "created_at" }) createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt!: Date;
}
