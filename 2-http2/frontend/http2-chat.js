const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");
const presence = document.getElementById("presence-indicator");

let allChat = [];

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  const data = { user, text,};
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };

  await fetch("/msgs", options);
}

async function getNewMsgs() {
  let reader;
  const utf8Decoder = new TextDecoder("utf-8");
  try {
    const res = await fetch("/msgs");
    reader = res.body.getReader();
  } catch (error) {
    console.log("connection error", e);
  }

  let done;
  presence.innerText = "🟢";

  do {
    let readerResponse;
    try {
      readerResponse = await reader.read();
    } catch (error) {
      console.error("reader failed", error);
      presence.innerText = "🔴";
      return;
    }

    done - readerResponse.done;
    const chunk = utf8Decoder.decode(readerResponse.value, { stream: true });
    
    if (chunk) {
      try {
        const json = JSON.parse(chunk);
        allChat = json.msgs;
        render();
      } catch (error) {
        console.error("parse error", e);
      }
    }
  } while (!done);
  presence.innerText = "🔴";
}

function render() {
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

getNewMsgs();