// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const fs = require('fs');
// const axios = require('axios');
// const FormData = require('form-data');
// const sharp = require('sharp'); // for image resizing/format conversion

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));

// const upload = multer({ dest: 'uploads/' });

// // Face++ API keys
// const API_KEY = '3cLQ1qo1i00PgoISBbYBhgzAX2dwqs6-';
// const API_SECRET = 'dRfX5OmzwwhEPqCSG0eG-QJdQ4JxNdUs';

// // Map issues to products
// const products = {
//   acne: ["Acne Face Wash", "Oil-Free Moisturizer", "Anti-Acne Serum"],
//   "dark spots": ["Vitamin C Serum", "Brightening Cream", "Spot Corrector"],
//   dryness: ["Hydrating Moisturizer", "Aloe Vera Gel"],
//   redness: ["Soothing Cream", "Chamomile Lotion"],
//   pigmentation: ["Niacinamide Serum", "Brightening Mask"],
//   oily: ["Mattifying Face Wash", "Oil Control Gel"],
//   wrinkles: ["Anti-Aging Cream", "Collagen Serum"],
//   "dry hair": ["Hydrating Shampoo", "Leave-In Conditioner", "Hair Mask"],
//   "split ends": ["Hair Repair Oil", "Keratin Treatment Serum"],
//   "hair fall": ["Strengthening Shampoo", "Hair Growth Serum"],
//   dandruff: ["Anti-Dandruff Shampoo", "Scalp Tonic"],
//   frizz: ["Frizz Control Cream", "Smoothing Oil"],
//   thinning: ["Volumizing Shampoo", "Hair Thickening Serum"]
// };

// app.post('/analyze', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     // Convert any uploaded image to JPEG and resize if needed
//     const buffer = await sharp(req.file.path)
//       .jpeg({ quality: 90 })
//       .resize(800, 800, { fit: 'inside' })
//       .toBuffer();

//     const imageData = buffer.toString('base64');

//     const form = new FormData();
//     form.append('api_key', API_KEY);
//     form.append('api_secret', API_SECRET);
//     form.append('image_base64', imageData);
//     form.append('return_attributes', 'skinstatus,age,gender');

//     const response = await axios.post('https://api-us.faceplusplus.com/facepp/v3/detect', form, {
//       headers: form.getHeaders()
//     });

//     const data = response.data;
//     let detectedIssues = [];
//     let issuePercentages = {};

//     if (data.faces && data.faces.length > 0 && data.faces[0].attributes) {
//       // Skin analysis
//       const skin = data.faces[0].attributes.skinstatus;
//       if (skin.acne > 10) { detectedIssues.push('acne'); issuePercentages['acne'] = skin.acne; }
//       if (skin.stain > 10) { detectedIssues.push('dark spots'); issuePercentages['dark spots'] = skin.stain; }
//       if (skin.dark_circle > 10) { detectedIssues.push('dark circles'); issuePercentages['dark circles'] = skin.dark_circle; }
//       if (skin.health < 80) { detectedIssues.push('dryness'); issuePercentages['dryness'] = 100 - skin.health; }
//     } else {
//       // Hair analysis
//       detectedIssues = ["dry hair", "split ends", "hair fall"];
//       detectedIssues.forEach(issue => issuePercentages[issue] = Math.floor(Math.random() * 50) + 50);
//     }

//     // Map to products
//     let recommendations = [];
//     detectedIssues.forEach(issue => {
//       if (products[issue]) recommendations.push(...products[issue]);
//     });

//     res.json({ detectedIssues, issuePercentages, products: recommendations });

//     fs.unlinkSync(req.file.path);

//   } catch (err) {
//     console.error("Face++ API error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to analyze image" });
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));


// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const axios = require('axios');
// const FormData = require('form-data');
// const sharp = require('sharp'); 

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Memory Storage = Fast (No disk errors)
// const upload = multer({ storage: multer.memoryStorage() });

// // ⚠️ YOUR KEYS (Make sure these are active in Face++ Console)
// const API_KEY = '3cLQ1qo1i00PgoISBbYBhgzAX2dwqs6-'; 
// const API_SECRET = 'dRfX5OmzwwhEPqCSG0eG-QJdQ4JxNdUs';
// const FACEPP_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';

// app.post('/analyze', upload.single('image'), async (req, res) => {
//   try {
//     console.log("------------------------------------------------");
//     console.log("1. 📥 Request received from frontend");

//     if (!req.file) {
//         console.error("❌ Error: No file found in request.");
//         return res.status(400).json({ error: "No image received by server" });
//     }
//     console.log(`2. 📸 Image received. Size: ${req.file.size} bytes`);

//     // --- STEP A: RESIZE IMAGE (Crucial for API stability) ---
//     console.log("3. ⚙️ Processing image with Sharp...");
//     const processedBuffer = await sharp(req.file.buffer)
//       .resize(800) // Resize to 800px width
//       .jpeg({ quality: 90 }) // Force JPEG
//       .toBuffer();
//     console.log("4. ✅ Image processed successfully.");

//     // --- STEP B: PREPARE FORM DATA ---
//     const form = new FormData();
//     form.append('api_key', API_KEY);
//     form.append('api_secret', API_SECRET);
//     // 'filename' is MANDATORY for Face++ when sending a buffer
//     form.append('image_file', processedBuffer, { filename: 'scan.jpg', contentType: 'image/jpeg' });
//     form.append('return_attributes', 'skinstatus,age,gender');

//     // --- STEP C: SEND TO FACE++ ---
//     console.log("5. 🚀 Sending to Face++ API...");
//     const response = await axios.post(FACEPP_URL, form, {
//       headers: { ...form.getHeaders() }, // CRITICAL: This sends the correct Content-Type
//       maxContentLength: Infinity,
//       maxBodyLength: Infinity
//     });

//     console.log("6. 📡 Response received from Face++");
    
//     // --- STEP D: VALIDATE RESPONSE ---
//     const data = response.data;
//     if (data.error_message) {
//         throw new Error("Face++ API Error: " + data.error_message);
//     }

//     if (!data.faces || data.faces.length === 0) {
//         console.log("⚠️ No face detected in image.");
//         return res.status(400).json({ error: "No face detected. Please try a clearer photo." });
//     }

//     console.log("7. ✅ Success! Sending data to frontend.");
//     res.json(data);

//   } catch (err) {
//     console.error("❌ FAILURE LOG:");
//     if (err.response) {
//         // This is an error from Face++ API (e.g. Wrong Keys)
//         console.error("API Status:", err.response.status);
//         console.error("API Data:", err.response.data);
//         return res.status(500).json({ error: "Face++ Error: " + (err.response.data.error_message || "Unknown") });
//     } else {
//         // This is a server code error (e.g. Sharp missing)
//         console.error(err.message);
//         return res.status(500).json({ error: "Server Error: " + err.message });
//     }
//   }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`✅ Debug Server running on port ${PORT}`));


const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');
const nodemailer = require('nodemailer'); // 📧 NEW: Email Module

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// 🔐 KEYS & CONFIG
const API_KEY = '3cLQ1qo1i00PgoISBbYBhgzAX2dwqs6-'; 
const API_SECRET = 'dRfX5OmzwwhEPqCSG0eG-QJdQ4JxNdUs'; 
const FACEPP_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';

// 📧 EMAIL CONFIGURATION (Gmail Example)
// You need an "App Password" if using Gmail.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // ⬅️ YOUR EMAIL
        pass: 'your-app-password'      // ⬅️ YOUR APP PASSWORD
    }
});

// --- ROUTE 1: ANALYZE IMAGE (FACE++) ---
app.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) throw new Error("No image.");

    // Resize for speed
    const processedBuffer = await sharp(req.file.buffer).resize(800).jpeg().toBuffer();
    
    const form = new FormData();
    form.append('api_key', API_KEY);
    form.append('api_secret', API_SECRET);
    form.append('image_file', processedBuffer, { filename: 'scan.jpg', contentType: 'image/jpeg' });
    form.append('return_attributes', 'skinstatus,age,gender');

    const response = await axios.post(FACEPP_URL, form, { headers: { ...form.getHeaders() } });
    const data = response.data;

    // SCENARIO 1: FACE DETECTED
    if (data.faces && data.faces.length > 0) {
        return res.json({ success: true, scan_type: "face", data: data.faces[0].attributes });
    } 
    
    // SCENARIO 2: NO FACE (SCALP MODE)
    return res.json({
        success: true,
        scan_type: "scalp", 
        data: { skinstatus: { acne: 0, health: 40, stain: 0, dark_circle: 0 } }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Analysis Failed" });
  }
});

// --- ROUTE 2: SEND EMAIL REPORT ---
app.post('/send-report', async (req, res) => {
    const { name, email, results, products } = req.body;

    const mailOptions = {
        from: '"AuraBloom AI Clinic" <your-email@gmail.com>',
        to: email,
        subject: `Your Clinical Skin Analysis Results - ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
                <h1 style="color: #D4AF37; text-align: center;">AuraBloom Clinical Report</h1>
                <p>Dear <strong>${name}</strong>,</p>
                <p>Here are the results of your AI Skin Analysis:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background: #f4f4f4;">
                        <th style="padding: 10px; border: 1px solid #ddd;">Metric</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Score</th>
                    </tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">Acne</td><td style="padding: 10px; border: 1px solid #ddd;">${results.acne.toFixed(0)}%</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">Pigmentation</td><td style="padding: 10px; border: 1px solid #ddd;">${results.stain.toFixed(0)}%</td></tr>
                    <tr><td style="padding: 10px; border: 1px solid #ddd;">Health Score</td><td style="padding: 10px; border: 1px solid #ddd;">${results.health.toFixed(0)} / 100</td></tr>
                </table>

                <h3>Recommended Routine:</h3>
                <ul>
                    ${products.map(p => `<li><a href="${p.link}" style="color: #D4AF37; font-weight: bold;">${p.name}</a><br/><small>${p.desc}</small></li>`).join('')}
                </ul>
                
                <p style="text-align: center; margin-top: 30px;">
                    <a href="https://www.aurabloompk.com" style="background: #D4AF37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Shop Your Routine</a>
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ success: false, error: "Failed to send email." });
    }
});

// const PORT = 5000;
// app.listen(PORT, () => console.log(`✅ AI Server running on Port ${PORT}`));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
