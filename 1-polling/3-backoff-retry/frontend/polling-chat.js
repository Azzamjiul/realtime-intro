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

async function getNewMsgs() {
  console.log("getNewMsgs()");
  let json;
  try {
    const res = await fetch("/poll");
    json = await res.json();
  } catch (error) {
    console.error(error);
  }
  allChat = json.msg;
  render();
  // setTimeout(getNewMsgs, INTERVAL);
}

function render() {
  const html = allChat.map(({ user, text, time, id }) =>
    template(user, text, time, id)
  );
  msgs.innerHTML = html.join("\n");
}

const template = (user, msg) =>
  `<li class="collection-item"><span class="badge">${user}</span>${msg}</li>`;

// getNewMsgs();
let timeToMakeNextRequest = 0;
async function rafTimer(time) {
  if (timeToMakeNextRequest <= time) {
    await getNewMsgs();
    timeToMakeNextRequest = time + INTERVAL;
  }
  requestAnimationFrame(rafTimer);
}

requestAnimationFrame(rafTimer);