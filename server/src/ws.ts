import { Server } from "socket.io";
import { WEBRTC_EVENTS, WEBRTC_EVENT_HANDLERS } from "./events";

const io = new Server({
    allowEIO3: true,
    cors: {
        origin: "*",
        allowedHeaders: "*"
    }
});

io.on("connection", (socket) => { 
  const socketEvents = Object.keys(WEBRTC_EVENT_HANDLERS);
  for (const event of socketEvents) {
    const eventHandler = WEBRTC_EVENT_HANDLERS[event];
    if (eventHandler) {
      socket.on(event, (data: object) => {
        console.log(data);
        eventHandler({
          data,
          event,
          socket,
        });
      });
    }
  }
});

io.listen(8000);
