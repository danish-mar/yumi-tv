const timeElement = document.getElementById('clock');
const slideshowElement = document.getElementById('slideshow');
const bodyElement = document.body; // Reference to the body element

const timeDataUrl = '/static/images/yumi-tv/time.json'; // Replace with your JSON file path

fetch(timeDataUrl)
    .then(response => response.json())
    .then(data => {
        createSlideshow(data);
    })
    .catch(error => console.error(error));

function showTime(data) {
    updateTime(); // Initial call to display current time

    setInterval(updateTime, 1000); // Update time every second
}

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const currentTime = `${hours}:${minutes}:${seconds}`;
    timeElement.textContent = currentTime;

    // Check background image brightness and update clock color
    checkBackgroundBrightness();
}

function createSlideshow(data) {
    const currentTime = getCurrentTime();
    const matchingFolder = data.folders.find(folder => isTimeInRange(currentTime, folder.startTime, folder.endTime));
    if (!matchingFolder) return;

    const imageCount = matchingFolder.qty;

    for (let i = 1; i <= imageCount; i++) {
        const image = document.createElement('img');
        image.src = `/static/images/yumi-tv/${matchingFolder.name}/${i}.jpeg`; // Ensure the file extension matches your actual files
        image.dataset.index = i; // Set the data-index attribute
        if (i === 1) {
            image.classList.add('active');
            // Set the initial background image without fade
            bodyElement.style.backgroundImage = `url("/static/images/yumi-tv/${matchingFolder.name}/${i}.jpeg")`;
        }
        slideshowElement.appendChild(image);
    }

    setInterval(() => changeSlide(imageCount), 30000); // Change image every 3 seconds
}

function changeSlide(imageCount) {
    const currentSlide = slideshowElement.querySelector('.active');
    const currentIndex = parseInt(currentSlide.dataset.index);

    currentSlide.classList.remove('active');

    let nextIndex = (currentIndex % imageCount) + 1; // Calculate the next index
    const nextSlide = slideshowElement.querySelector(`img[data-index="${nextIndex}"]`);
    nextSlide.classList.add('active');

    // Fade out current background image
    bodyElement.style.opacity = 0;

    // Change background image with fade effect
    setTimeout(() => {
        bodyElement.style.backgroundImage = `url("/static/images/yumi-tv/${nextSlide.parentNode.id}/${nextIndex}.jpeg")`;
        bodyElement.style.opacity = 1;

        // Check background image brightness and update clock color
        checkBackgroundBrightness();
    }, 500); // Adjust timing as needed for fade effect
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

function isTimeInRange(currentTime, startTime, endTime) {
    const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const currentTotalMinutes = currentHours * 60 + currentMinutes;
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
}

function checkBackgroundBrightness() {
    // Get current background image URL
    const backgroundImageUrl = bodyElement.style.backgroundImage.slice(4, -1).replace(/["|']/g, "");

    // Create a temporary image element to calculate average brightness
    const tempImg = new Image();
    tempImg.crossOrigin = "Anonymous";
    tempImg.src = backgroundImageUrl;
    tempImg.onload = function() {
        const brightness = calculateAverageBrightness(tempImg);

        // Set clock color based on brightness
        if (brightness < 128) {
            // Dark background, set clock text color to white
            timeElement.style.color = '#ffffff';
        } else {
            // Light background, set clock text color to dark
            timeElement.style.color = '#000000';
        }
    };
}

function calculateAverageBrightness(imgElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Ensure canvas size matches image size
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    // Draw image onto canvas
    ctx.drawImage(imgElement, 0, 0);

    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let brightnessSum = 0;

    // Calculate average brightness
    for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3; // Average of RGB values
        brightnessSum += brightness;
    }

    const pixelCount = data.length / 4;
    const averageBrightness = brightnessSum / pixelCount;

    return averageBrightness;
}
