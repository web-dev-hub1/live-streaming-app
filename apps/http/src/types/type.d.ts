import { JwtPayload } from "jsonwebtoken";
interface userDetails {
  email: string;
  password: string;
  id: string;
  userName: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
}
//Auth request Middleware
declare module "express" {
  export interface Request {
    user?: JwtPayload;
    userDetails?: userDetails;
  }
}
