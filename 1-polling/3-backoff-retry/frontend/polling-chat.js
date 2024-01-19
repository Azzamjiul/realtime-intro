const chat = document.getElementById("chat");
const msgs = document.getElementById("msgs");

let allChat = [];
const INTERVAL = 3000;

chat.addEventListener("submit", function (e) {
  e.preventDefault();
  postNewMsg(chat.elements.user.value, chat.elements.text.value);
  chat.elements.text.value = "";
});

async function postNewMsg(user, text) {
  console.log("postNewMsg()");
  const data = { user, text };
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  await fetch("/poll", options);
}

let failedTries = 0;
async function getNewMsgs() {
  console.log("getNewMsgs()");
  let json;
  try {
    const res = await fetch("/poll");

    if (res.status >= 400) {
      throw new Error("request did not succeed: " + res.status);
    }

    json = await res.json();
    allChat = json.msg;
    render();
    failedTries = 0;
  } catch (error) {
    console.error(error);
    failedTries++;
  }
}

function render() {
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

const BACKOFF = 5000;
let timeToMakeNextRequest = 0;
async function rafTimer(time) {
  if (timeToMakeNextRequest <= time) {
    await getNewMsgs();
    timeToMakeNextRequest = time + INTERVAL + failedTries * BACKOFF;
  }
  requestAnimationFrame(rafTimer);
}

requestAnimationFrame(rafTimer);