import { WebSocketServer } from "ws";
import { RoomManager } from "./room-manager";
import { User } from "./user-class";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Role } from "@repo/db/client";
import { verifiedUserDetails } from "@repo/types";
dotenv.config({ path: "../../.env" });

const wss = new WebSocketServer({ port: 8080 });

wss.on("listening", () => {
  console.log("WebSocket server is now running 8080");
});
function checkUser(token: string): verifiedUserDetails | null {
  try {
    if (!process.env.JWT_SECRET) {
      return null;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      email: string;
      userName: string;
      role: Role;
    };

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded) {
      return null;
    }

    return decoded;
  } catch (e) {
    return null;
  }
}
const roomManager = new RoomManager();
wss.on("connection", function connection(ws, req) {
  const url = req.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]); //ws:localhost:8080?token='aakhska'

  const token = queryParams.get("token") || "";
  const userDetails = checkUser(token);
  if (!userDetails) {
    ws.close();
    return;
  }
  const currentUser = new User(userDetails, ws);
  roomManager.addUser(currentUser);
  ws.on("message", function message(data) {
    console.log("received: %s", data.toString());
    ws.send(`Your data is recieved i.e ${data.toString()}`);
  });
  ws.on("close", () => {
    console.log("Client Disconnected");
  });
  ws.on("error", (err) => {
    console.log("error establishing connection", err);
  });
});
