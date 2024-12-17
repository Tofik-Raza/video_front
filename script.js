const serverUrl = "https://video-calling-0lkd.onrender.com"; // Replace with your Render server URL

const socket = io(serverUrl);

// HTML elements
const localVideo = document.getElementById("localVideo");
const serverVideo = document.getElementById("serverVideo");

// Access user's webcam
navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
        localVideo.srcObject = stream;

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Send frames to server
        setInterval(() => {
            context.drawImage(localVideo, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL("image/jpeg");
            socket.emit("send_frame", frameData);
        }, 100);

        // Listen for frames from the server
        socket.on("receive_frame", (frame) => {
            const img = new Image();
            img.src = frame;
            img.onload = () => {
                const serverCanvas = document.createElement("canvas");
                serverCanvas.width = img.width;
                serverCanvas.height = img.height;
                const serverContext = serverCanvas.getContext("2d");
                serverContext.drawImage(img, 0, 0);
                serverVideo.srcObject = serverCanvas.captureStream();
            };
        });
    })
    .catch((error) => {
        console.error("Error accessing webcam:", error);
    });
