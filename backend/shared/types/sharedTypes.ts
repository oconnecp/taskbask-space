//In the future we will build these and publish the package to be imported in both 
//the frontend and backend projects
//for now we will just copy the types as needed
export type UserDTO = {
  id: string,
  name: string,
  email: string,
  profilePictureUrl: string
}

export type NewTaskDTO = {
  projectId: string,
  assigneeId: string | null,
  statusId: string,
  title: string,
  description: string | null,
  dueDate: Date | null,
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export type TaskDTO = NewTaskDTO & {
  id: string,
  createdById: string | null,
  createdAt: Date,
  updatedAt: Date
}

export type NewProjectDTO = {
  name: string,
  description: string | null
}

export type ProjectDTO = NewProjectDTO & {
  id: string,
  createdAt: Date,
  updatedAt: Date
}

export type ProjectMembershipDTO = {
  id: string,
  projectId: string,
  userId: string,
  role: 'OWNER' | 'EDITOR' | 'VIEWER'
}

export type ProjectStatusDTO = {
  id: string,
  projectId: string,
  name: string,
  order: number
}

export type ProjectPayloadDTO = {
  project: ProjectDTO,
  memberships: ProjectMembershipDTO[],
  statuses: ProjectStatusDTO[]
}