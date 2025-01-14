

const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute("ns");

  console.log(nsEndpoint);

  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);

  selectedNsId = clickedNs.id;

  const rooms = clickedNs.rooms;

  let roomList = document.querySelector(".room-list");
  roomList.innerHTML = "";

 

  let firstRoom;

  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }
    console.log(room);
    roomList.innerHTML += `<li class="room" namespaceId=${
      room.namespaceId
    }><span class="fa-solid fa-${room.privateRoom ? "lock" : "globe"}"></span>${
      room.roomTitle
    }</li>`;
  });

  joinRoom(firstRoom, clickedNs.id);

  

  const roomNodes = document.getElementsByClassName("room");
  Array.from(roomNodes).forEach((elem, i) => {
    elem.addEventListener("click", (e) => {
      const nameSpaceId = elem.getAttribute("namespaceId");
      joinRoom(e.target.innerText, nameSpaceId);
    });
  });

  localStorage.setItem("lastNs", JSON.stringify(nsEndpoint));
};
