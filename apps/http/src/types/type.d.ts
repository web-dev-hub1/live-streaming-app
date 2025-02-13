import { JwtPayload } from "jsonwebtoken";
import { Request as expressRequest } from "express";

export interface userDetails {
  email: string;
  password: string;
  id: string;
  userName: string;
  role: $Enums.Role;
  createdAt?: Date;
  updatedAt?: Date;
}
//Auth request Middleware
declare module "express" {
  export interface Request extends expressRequest {
    user?: JwtPayload;
    userDetails?: userDetails;
  }
}
