const buildMessageHtml = (messageObj) => {
  return `<li>
    <div class="user-image">
      <img src="${messageObj.avatar}" />
    </div>
    <div class="user-message">
      <div class="user-name-time">${
        messageObj.userName
      } <span>${timeFormatter.format(new Date(messageObj.date))}</span></div>
      <div class="message-text text-primary">${messageObj.newMessage}</div>
    </div>
  </li>
  `;
};
