import http2 from "http2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handler from "serve-handler";

let connections = [];

const msg = [];
const getMsgs = () => Array.from(msg).reverse();

msg.push({ user: "azzam", text: "hi",});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, "/../server.crt")),
  key: fs.readFileSync(path.join(__dirname, "/../key.pem")),
});

/* some code goes here */
server.on("stream", (stream, headers) => {
  const method = headers[":method"];
  const path = headers[":path"];
  if (path === "/msgs" && method === "GET") {
    console.log('connected');
    stream.respond({
      ":status": 200,
      "content-type": "text/plain; charset=utf-8",
    });
    stream.write(JSON.stringify({ msgs: getMsgs() }));
    connections.push(stream);
    stream.on("close", () => {
      console.log('disconnected');
      connections = connections.filter((s) => s !== stream);
    })
  }
});

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
    msg.push({user, text});
    res.end();
    connections.forEach((stream) => {
      stream.write(JSON.stringify({ msgs: getMsgs() }));
    })
  }
});

// start listening
const port = process.env.PORT || 3000;
server.listen(port, () =>
  console.log(
    `Server running at https://localhost:${port} - make sure you're on httpS, not http`
  )
);