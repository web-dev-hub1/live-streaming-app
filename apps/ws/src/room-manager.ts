import { EventTypes } from "@repo/types";
import { User } from "./user-class";
import { Role } from "@repo/db/client";

export class RoomManager {
  private rooms = new Map<
    string,
    { chatEnable: boolean; usersArray: User[] }
  >(); //roomId - users[]
  private users: User[] = [];
  constructor() {}

  addUser(user: User) {
    this.users.push(user);
    this.addHandler(user);
  }
  broadCastMessage(roomId: string, message: any, excludeUser?: User) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.usersArray.forEach((user) => {
      if (excludeUser && excludeUser.DisplayName !== user.DisplayName) {
        user.socket.send(JSON.stringify(message));
      }
    });
  }
  private addHandler(user: User) {
    user.socket.on("message", async (data) => {
      const message = JSON.parse(data.toString());
      switch (message.type) {
        case EventTypes.CREATE_ROOM:
          const { roomId, role }: { roomId: string; role: Role } =
            message.payload;
          if (role !== "ADMIN") return;
          if (!this.rooms.has(roomId)) {
            return user.socket.send(
              JSON.stringify({
                type: EventTypes?.ERROR,
                message: "room Id already exist",
              })
            );
          }
          // create room and add user in roomsMap
          break;
        case EventTypes.JOIN_ROOM:
          // handle admin case and user case and broadcast message
          break;
        case EventTypes.CURSOR_MOVE:
          //handle cursor movement and broadcast message to all(room user's)
          break;
        case EventTypes.CHAT_MESSAGE:
          // handle message and check beforehand chat enable or not, broadcast message to all(room user's)
          break;
        case EventTypes.CHAT_ENABLE:
          //verify admin and cohost , send chat_enable(true|false) event
          break;
      }
    });
  }
}
