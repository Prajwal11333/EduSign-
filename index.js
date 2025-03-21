import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

// The application uses axios to fetch video data from another API service running at http://localhost:4000
// The code handles both direct page access and AJAX requests:
// For AJAX requests, it returns JSON data
// Body-parser is middleware for Express.js that parses incoming request bodies: as it will convert into json object into js

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render('home.ejs');
});

app.get("/tutorials", (req, res) => {
    res.render("tutorials.ejs");
}
)

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.get("/translator", (req, res) => {
    res.render("translator.ejs");
})
app.get("/about-us",(req,res)=>{
    res.render("about-us.ejs")
})

// video data fetching from basic.ejs as try and catch method
app.get("/tutorials/basics", async (req, res) => {
    try {
        // By default, load the Introduction video (001)
        const response = await axios.get(`${API_URL}/videolib/001`);
        res.render("basics.ejs", {
            videos: response.data
        });
    } catch (error) {
        console.error("Error fetching default video:", error.message);
        res.render("basics.ejs", {
            videos: null
        });
    }
});


app.get("/tutorials/basics/:id", async (req,res) => {
    const videoId = req.params.id;
    try {
        const response = await axios.get(`${API_URL}/videolib/${videoId}`);
        
        // Check if this is an AJAX request (looks for XHR header or accepts JSON)
        const isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1;
        
        if (isAjaxRequest) {
            // Return JSON for AJAX requests
            res.json({
                videos: response.data
            });
        } else {
            // Return full page for direct access
            res.render("basics.ejs", {
                videos: response.data
            });
        }
    } catch(error) {
        console.error("Error fetching video:", error.message);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(500).json({message: "Error fetching the video"});
        } else {
            res.status(500).render("error.ejs", {message: "Error fetching the video"});
        }
    }
})

app.get("/tutorials/family-signs", async (req, res) => {
    try {
        // By default, load the Family Signs video (004)
        const response = await axios.get(`${API_URL}/videolib/004`);
        res.render("family-signs.ejs", {
            videos: response.data
        });
    } catch (error) {
        console.error("Error fetching default video:", error.message);
        res.render("family-signs.ejs", {
            videos: null
        });
    }
});

app.get("/tutorials/family-signs/:id", async (req, res) => {
    const videoId = req.params.id;
    try {
        const response = await axios.get(`${API_URL}/videolib/${videoId}`);
        
        // Check if this is an AJAX request
        const isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1;
        
        if (isAjaxRequest) {
            // Return JSON for AJAX requests
            res.json({
                videos: response.data
            });
        } else {
            // Return full page for direct access
            res.render("family-signs.ejs", {
                videos: response.data
            });
        }
    } catch(error) {
        console.error("Error fetching video:", error.message);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(500).json({message: "Error fetching the video"});
        } else {
            res.status(500).render("error.ejs", {message: "Error fetching the video"});
        }
    }
});

app.get("/tutorials/emotions-expressions", async (req, res) => {
    try {
        // By default, load the Emotions Introduction video (007)
        const response = await axios.get(`${API_URL}/videolib/005`);
        res.render("emotions-expressions.ejs", {
            videos: response.data
        });
    } catch (error) {
        console.error("Error fetching default video:", error.message);
        res.render("emotions-expressions.ejs", {
            videos: null
        });
    }
});

app.get("/tutorials/emotions-expressions/:id", async (req, res) => {
    const videoId = req.params.id;
    try {
        const response = await axios.get(`${API_URL}/videolib/${videoId}`);
        
        // Check if this is an AJAX request
        const isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1;
        
        if (isAjaxRequest) {
            // Return JSON for AJAX requests
            res.json({
                videos: response.data
            });
        } else {
            // Return full page for direct access
            res.render("emotions-expressions.ejs", {
                videos: response.data
            });
        }
    } catch(error) {
        console.error("Error fetching video:", error.message);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.status(500).json({message: "Error fetching the video"});
        } else {
            res.status(500).render("error.ejs", {message: "Error fetching the video"});
        }
    }
});

app.listen(port, () => {
    console.log("server listening on port" + port);
})

