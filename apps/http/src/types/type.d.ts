import { JwtPayload } from "jsonwebtoken";
import { Request as ExpressRequest } from "express";
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
  export interface Request extends ExpressRequest {
    user?: JwtPayload;
    userDetails?: userDetails;
  }
}
