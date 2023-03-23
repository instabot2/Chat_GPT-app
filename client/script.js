const imageUrl = "rotater.gif";
const displayTime = 10000;

const image = document.getElementById("image");
image.src = imageUrl;

setTimeout(() => {
  image.src = "";
}, displayTime);
