import { Role } from "@repo/db/client";
import { verifiedUserDetails } from "@repo/types";
import { WebSocket } from "ws";
export interface UserICursor {
  x: number;
  y: number;
}
export class User {
  public socket: WebSocket;
  public DisplayName: string;
  public role: Role;

  constructor(userDetails: verifiedUserDetails, socket: WebSocket) {
    this.socket = socket;
    this.DisplayName = userDetails.userName;
    this.role = userDetails.role;
  }
}
