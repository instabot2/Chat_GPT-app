const imageUrl = "your-image-url-here";
const displayTime = 5000;

const image = document.getElementById("image");
image.src = imageUrl;

setTimeout(() => {
  image.src = "";
}, displayTime);
