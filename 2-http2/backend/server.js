import http2 from "http2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handler from "serve-handler";

let connections = [];

const msg = [{ user: "Azzam", text: "inital message", time: Date.now() }];
const getMsgs = () => Array.from(msg).reverse();

msg.push({ user: "azzam", text: "hi",});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, "/../server.crt")),
  key: fs.readFileSync(path.join(__dirname, "/../key.pem")),
});

/* some code goes here */

server.on("request", async (req, res) => {
  const path = req.headers[":path"];
  const method = req.headers[":method"];

  if (path !== "/msgs") {
    return handler(req, res, {
      public: "./frontend",
    });
  } else if (method === "POST") {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    const { user, text } = JSON.parse(data);

    /* some code goes here */
  }
});

// start listening
const port = process.env.PORT || 8080;
server.listen(port, () =>
  console.log(
    `Server running at https://localhost:${port} - make sure you're on httpS, not http`
  )
);