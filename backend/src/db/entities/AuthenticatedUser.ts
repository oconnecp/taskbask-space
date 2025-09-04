import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class AuthenticatedUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ nullable: true })
  profilePic?: string; // Optional field for profile picture URL

  @Column()
  accessToken!: string;

  @Column()
  refreshToken!: string;

  @Column()
  authProvider!: string;
}