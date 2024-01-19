import http from "http";
import handler from "serve-handler";

// helpers for handling binary data
import objToResponse from "./obj-to-response.js";
import generateAcceptValue from "./generate-accept-value.js";
import parseMessage from "./parse-message.js";

let connections = [];
const msg = [];
const getMsgs = () => Array.from(msg).reverse();

msg.push({ user: "azzam", text: "hi", });

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});

/* code here */
server.on("upgrade", function (req, socket) {
  if (req.headers["updare" !== "websocket"]) {
    socket.end("HTTP/1.1 400 Bad Request");
    return;
  }

  console.log("upgrade requested!");

  const acceptKey = req.headers["sec-websocket-key"];
  const acceptValue = generateAcceptValue(acceptKey);
  const headers = [
    "HTTP/1.1 101 Web Socket Protocol Handshake",
    "Upgrade: WebSocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${acceptValue}`,
    "Sec-WebSocket-Protocol: json",
    "\r\n",
  ];

  socket.write(headers.join("\r\n"));
  socket.write(objToResponse({ msg: getMsgs() }));
  connections.push(socket);

  console.log("upgrade success!");

  socket.on("data", (buffer) => {
    console.log('buffer', buffer)
    const message = parseMessage(buffer);
    if (message) {
      console.log(message);
      msg.push({
        user: message.user,
        text: message.text,
      });

      connections.forEach((s) => s.write(objToResponse({ msg: getMsgs() })));
    } else if (message === null) {
      socket.end();
    }
  });

  socket.on("end", () => {
    connections = connections.filter((s) => s !== socket);
  });

})

const port = process.env.PORT || 3000;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);