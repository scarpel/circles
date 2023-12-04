import { TObject } from "@customTypes/common";
import { Socket, io } from "socket.io-client";

export type TSocketEvent = {};

export class SocketClient {
  socket!: Socket;
  events: TObject<TSocketEvent> = {};
  accessToken: string = "";

  constructor(public readonly uri: string = "http://localhost:4000") {}

  initialize(accessToken: string) {
    if (!accessToken) throw new Error("Invalid acces token!");

    if (this.socket) this.socket.close();

    this.accessToken = accessToken;

    this.socket = io(this.uri, {
      extraHeaders: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return this.socket;
  }

  private reset() {
    this.events = {};
  }

  private checkConnection() {
    if (!this.socket?.connected) throw new Error("Socket not connected!");

    return true;
  }

  async connect() {
    this.reset();

    if (this.socket.connected) return true;

    return new Promise((res, rej) =>
      this.socket.on("connect", () => {
        return this.socket.connected ? res(true) : rej(false);
      })
    );
  }

  async disconnect() {
    this.reset();

    if (!this.socket?.connected) return true;

    this.socket.close();

    return new Promise((res, rej) => {
      this.socket.on("disconnect", () => {
        return this.socket.connected ? rej(false) : res(true);
      });
    });
  }

  async registerEvent(eventName: string, callback: (...args: any[]) => void) {
    this.checkConnection();

    this.socket.on(eventName, callback);
  }

  async emitEvent(
    eventName: string,
    value?: any,
    callback?: (value?: any) => void
  ) {
    this.checkConnection();

    return callback
      ? this.socket.emit(eventName, value, callback)
      : this.socket.emit(eventName, value);
  }
}

export const socketClient = new SocketClient();
