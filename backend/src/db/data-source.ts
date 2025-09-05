import "reflect-metadata";
import { DataSource } from "typeorm";

import { TBProject } from "./entities/tbProject";
import { TBProjectMembership } from "./entities/tbProjectMembership";
import { TBProjectStatus} from "./entities/tbProjectStatus";
import { TBTask } from "./entities/tbTask";
import { TBUser } from "./entities/tbUser";

import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } from "../tools/constants";

export const appDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST, // e.g., "localhost"
  port: parseInt(DB_PORT), // Default PostgreSQL port
  username: DB_USERNAME, // e.g., "postgres"
  password: DB_PASSWORD, // e.g., "password"
  database: DB_NAME, // e.g., "mydatabase"
  synchronize: true, // Set to false in production
  logging: true,
  entities: [TBProject, TBProjectMembership, TBProjectStatus, TBTask, TBUser], 
});