import {Role} from '@repo/db/client'
export enum EventTypes{
    SLIDE_CHANGED='SLIDE_CHANGED',
    CHAT_MESSAGE='CHAT_MESSAGE',
    STROKE='STROKE',
    CLEAR_SLIDE='CLEAR_SLIDE',
    CHAT_ENABLE='CHAT_ENABLE',
    SUBSCRIBE='SUBSCRIBE',
    SUBSCRIBE_ADMIN='SUBSCRIBE_ADMIN',
    CREATE_ROOM='CREATE_ROOM',
    JOIN_ROOM='JOIN_ROOM',
    CURSOR_MOVE='CURSOR_MOVE',
    ERROR='ERROR'
}
export type ClientMessage = {
    type:string,
    payload:any
}
export type verifiedUserDetails = {
    email: string;
    userName: string;
    role: Role;
}