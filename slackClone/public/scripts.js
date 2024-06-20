const userName = "John";
const password = "O";

const clientOptions = {
  query: {
    userName,
    password,
  },

  auth: {
    userName,
    password,
  },
};

const socket = io("http://localhost:9000", clientOptions);

const nameSpaceSockets = [];

const listeners = {
  nsChange: [],
  messageToRoom: [],
};

let selectedNsId = 0;

document.getElementById("message-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const newMessage = document.getElementById("user-message").value;
  console.log(newMessage, selectedNsId);
  nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    date: Date.now(),
    avatar: "http://via.placeholder.com/30",
    userName,
    selectedNsId,
  });

  document.getElementById("user-message").value = "";
});

const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("Namespace Changed");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    nameSpaceSockets[nsId].on("messageToRoom", (messageObj) => {
      console.log(messageObj);
      const messageHtml = buildMessageHtml(messageObj);
      document.getElementById("messages").innerHTML += messageHtml;
    });
    listeners.messageToRoom[nsId] = true;
  }
};

const timeFormatter = new Intl.DateTimeFormat("en-us", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("clientConnect");
});

socket.on("nsList", (nsData) => {
  const lastNs = localStorage.getItem("lastNs");

  const nameSpacesDiv = document.getElementsByClassName("namespaces")[0];

  nameSpacesDiv.innerHTML = "";

  nsData.forEach((ns, index) => {
    nameSpacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"/></div>`;

    if (!nameSpaceSockets[ns.id]) {
      nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }
    addListeners(ns.id);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (elem, i) => {
      console.log(elem);
      elem.addEventListener("click", (e) => {
        joinNs(elem, nsData);
      });
    }
  );

  if (lastNs) {
    const nsElement = document.querySelector(`.namespace[ns=${lastNs}]`);
    joinNs(nsElement, nsData);
  } else {
    joinNs(document.getElementsByClassName("namespace")[0], nsData);
  }
});
