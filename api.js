import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";

const app = express();
const port = 4000;
const PYTHON_API_URL = "http://localhost:5000/predict";

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.get("/videolib/:id", (req, res) => {
    const video = videolib.find((v) => v.id === (req.params.id));
    if (!video) return res.status(404).json({ message: "Video not found" });
    console.log(video);
    res.json(video);
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/predict", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image file received" });
    }

    try {
        console.log("Sending image to Flask backend...");

        const formData = new FormData();
        formData.append("image", req.file.buffer, {
            filename: "frame.jpg",
            contentType: "image/jpeg",
        });

        const response = await axios.post(PYTHON_API_URL, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log("Flask Response:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error in API:", error.message);
        res.status(500).json({ message: "Failed to process image", error: error.message });
    }
});


const videolib = [
    {
        id: "001",
        title: "Introduction",
        video: encodeURI("/assets/videos/Introduction.mp4"),
    },
    {
        id: "002",
        title: "Alphabets",
        video: encodeURI("/assets/videos/Alphabets.mp4"),
    },
    {
        id: "003",
        title: "Numbers",
        video: encodeURI("/assets/videos/Numbers.mp4"),
    },
    {
        id: "004",
        title: "Family Signs",
        video: encodeURI("/assets/videos/family.mp4"),
    },
    {
        id: "005",
        title: "Parents Signs",
        video: encodeURI("/assets/videos/feelings.mp4"),
    },
]
app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });