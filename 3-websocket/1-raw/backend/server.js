import http from "http";
import handler from "serve-handler";

// these are helpers to help you deal with the binary data that websockets use
import objToResponse from "./obj-to-response.js";
import generateAcceptValue from "./generate-accept-value.js";
import parseMessage from "./parse-message.js";

let connections = [];
const msg = [];
const getMsgs = () => Array.from(msg).reverse();

msg.push({ user: "azzam", text: "hi",});

const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: "./frontend",
  });
});

/* code here */

const port = process.env.PORT || 3000;
server.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);