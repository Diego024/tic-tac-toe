const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn");
const whyNotSticker = document.getElementById("why-not_sticker");
const invitationContainer = document.getElementById("invitation");

const setEventListeners = () => {
    rejectBtn.addEventListener("click", function () {
        whyNotSticker.style.right = "0";
        invitationContainer.style.display = "none"
    });

    acceptBtn.addEventListener("click", function () {
        whyNotSticker.style.right = "-200px";
        invitationContainer.style.display = "flex"
    });
}

setEventListeners();