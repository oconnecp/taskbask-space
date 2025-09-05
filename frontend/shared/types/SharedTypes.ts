//In the future we will build these and publish the package to be imported in both 
//the frontend and backend projects
//for now we will just copy the types as needed
export type UserDTO = {
  id: string,
  name: string,
  email: string,
  profilePictureUrl: string
}

export type TaskDTO = {
  id: string,
  projectId: string,
  assigneeId: string | null,
  statusId: string,
  title: string,
  description: string | null,
  dueDate: Date | null,
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdById: string | null,
  createdAt: Date,
  updatedAt: Date
}

export type ProjectDTO = {
  id: string,
  name: string,
  description: string | null,
  createdAt: Date,
  updatedAt: Date
}