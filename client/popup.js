const imageContainer = document.getElementById('image-container');
const imageUrl = 'rotater.gif';
const displayTime = 10000; // display time in milliseconds

// create the image element and set its properties
const image = document.createElement('img');
image.src = imageUrl;
image.style.width = '50%';

// add the image to the container
imageContainer.appendChild(image);

// set a timeout to remove the image after the display time has passed
setTimeout(() => {
  imageContainer.removeChild(image);
}, displayTime);
