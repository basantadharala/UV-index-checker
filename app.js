import express from 'express';
import axios from 'axios';
import 'dotenv/config';



const app = express();
const port = 3000;

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index.ejs", { uvIndex: null, sunscreenAdvice: null });
})



app.get('/check-uv', async (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    const apiKey = process.env.OPENUV_API_KEY;




    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and Longitude are required" });
    }

    try {
        const response = await axios.get("https://api.openuv.io/api/v1/uv", {
            headers: { 'x-access-token': apiKey },
            params: {
                lat: lat,
                lng: lon,
            }
        });
        const uvIndex = response.data.result.uv;
        let sunscreenAdvice;

        if (uvIndex > 3) {
            sunscreenAdvice = "Yes, apply sunscreen!";
        } else {
            sunscreenAdvice = "No need for the sunscreen today";
        }
        res.json({
            uvIndex: uvIndex,
            sunscreenAdvice: sunscreenAdvice,
        });

    } catch (error) {
        console.error("Error fetching UV data:", error);
        res.status(500).json({ error: "Couldn't fetch UV data. Please try again later." });
    }
})

app.listen(port, () => {
    console.log(`The server is running in port ${port}`);
})