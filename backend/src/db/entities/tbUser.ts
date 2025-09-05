import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn, UpdateDateColumn
} from "typeorm";

@Entity({ name: "tb_users" })
export class TBUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Auth0 "sub" (e.g. "auth0|abc123" or "google-oauth2|..."); unique
  @Index({ unique: true })
  @Column({ name: "auth_zero_id", type: "varchar", length: 255 })
  authZeroId!: string;

  @Column({ type: "varchar", length: 120, nullable: true })
  name!: string | null;

  @Index()
  @Column({ type: "varchar", length: 255, nullable: true })
  email!: string | null;

  @Column({ name: "profile_picture_url", type: "text", nullable: true })
  profilePictureUrl!: string | null;

  // keep raw profile if you want (optional)
  @Column({ name: "profile_json", type: "jsonb", nullable: true })
  profileJson!: Record<string, any> | null;

  @Column()
  accessToken!: string;

  @Column()
  authProvider!: string;

  @CreateDateColumn({ name: "created_at" }) createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt!: Date;
}
