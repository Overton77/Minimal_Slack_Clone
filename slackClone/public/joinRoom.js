const joinRoom = async (roomTitle, nameSpaceId) => {
  console.log(roomTitle, nameSpaceId);
  const ackResp = await nameSpaceSockets[nameSpaceId].emitWithAck("joinRoom", {
    roomTitle,
    nameSpaceId,
  });

  ackResp.history.forEach((message) => {
    document.getElementById("messages").innerHTML = buildMessageHtml(message);
  });
  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResp.numUsers} <span class="fa-solid fa-user"></span>`;

  document.querySelector(".curr-room-text").innerHTML = roomTitle;
};
