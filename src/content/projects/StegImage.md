---
title: "Building a Steganography App with Node.js and Python"
summary: "A Simple Stegnography App for Awarness"
date: 2023-02-15
tags: [Cybersecurity, Stegnography]
category: "tools"
link: https://github.com/Sayanth2091/Stegimage.git
---


# Deep Dive: Building a Steganography App with Node.js and Python

Have you ever wanted to send a secret message, hidden in plain sight? That's the magic of steganography, the art of concealing a message within another, non-secret file. Today, we're taking a deep dive into **StegImage**, a web application that lets you hide secret text inside images and audio files.

This project is a fantastic example of a polyglot architecture, combining a Node.js backend for handling web requests with Python for the heavy lifting of cryptography and data manipulation. Let's break down how it all works, from the server setup to the individual bits and bytes of the steganography process.

## Project Architecture: The Best of Both Worlds

StegImage uses a simple but powerful architecture:

1.  **Node.js & Express.js Backend**: A lightweight server handles HTTP requests, manages file uploads, and serves the user interface. Node.js is perfect for this kind of I/O-bound work.
2.  **Python for Core Logic**: The complex tasks of encrypting the message and embedding it into the media files are offloaded to Python scripts. Python, with its rich ecosystem of libraries like Pillow and `cryptography`, is ideal for these data-intensive operations.
3.  **`python-shell` as the Bridge**: The `python-shell` library acts as the crucial link between the Node.js and Python worlds, allowing the Express server to execute the Python scripts and retrieve their output.
4.  **React Frontend (Inferred)**: The frontend is a pre-built Single Page Application (SPA), most likely built with a framework like React, which communicates with the backend via a RESTful API.

## Getting Started: Running StegImage Locally

Ready to try it out yourself? Here’s how you can get the project up and running on your local machine.

### Prerequisites

*   [Node.js and npm](https://nodejs.org/)
*   [Python 3](https://www.python.org/)
*   The required Python libraries. You can install them using pip:

```bash
pip install cryptography Pillow
```

### Setup and Execution

1.  **Clone the Repository** (assuming it's in a git repository):
    ```bash
git clone <repository-url>
cd Stegimage/StegImage
```

2.  **Install Node.js Dependencies**:
    Navigate to the `StegImage` directory and run:
    ```bash
npm install
```
    This will install all the backend dependencies listed in `package.json`, including Express, Multer, and `python-shell`.

3.  **Start the Server**:
    ```bash
node index.js
```
    You should see a confirmation message in your terminal:
    ```
The server is listening on 3001
```

4.  **Access the Application**:
    Open your web browser and navigate to `http://localhost:3001`. You should now see the StegImage user interface.

## The Backend: An Express.js API

The backend is the application's central nervous system. Let's look at how it's put together.

### `index.js`: The Server Entry Point

This file sets up the Express server, configures middleware, and defines the main routes.

```javascript
// C:\Users\sayan\Documents\Work\sidegigs\stegimage\Stegimage\StegImage\index.js
const imageroutes = require('./routes/ImageRoutes');
const audioroutes = require('./routes/AudioRoutes');

const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Serve the static frontend build
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use(cors());

// Register API routes
app.use(imageroutes);
app.use(audioroutes);

// Serve the main index.html for the frontend
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(3001);
console.log("The server is listening on 3001");
```

### API Routes and `python-shell`

The real action happens in the route files. The server listens for `POST` requests to `/image/encode`, `/image/decode`, and their audio counterparts.

Here's a look at the image encoding route in `routes/ImageRoutes.js`.

```javascript
// C:\Users\sayan\Documents\Work\sidegigs\stegimage\Stegimage\StegImage\routes\ImageRoutes.js
router.post('/image/encode', urlencodedParser, upload.single('file'), (req, res) => {
    try {
        console.log(req.body.password + " " + req.body.message);
        console.log(nameoffile); // The filename assigned by Multer

        let options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: path.join(__dirname.replace('routes', 'uploads')),
            args: [nameoffile, '1', req.body.message, req.body.password]
        };

        PythonShell.run('imagefunctions.py', options, function(err, results) {
            if (err) throw (err);
            console.log(results);
        });

        res.send(`http://localhost:3001/encimg/enc${nameoffile}`);
    } catch (error) {
        console.log(error);
    }
});
```

Here's what's happening:

1.  **File Upload**: `multer` middleware intercepts the file from the request and saves it to the `uploads/` directory with a unique name.
2.  **`python-shell` Options**: An `options` object is created to configure the Python script execution.
    *   `scriptPath`: Specifies the directory where the Python script is located.
    *   `args`: This is the crucial part. It passes the filename, an operation flag ('1' for encode), the secret message, and the password as command-line arguments to the Python script.
3.  **Execution**: `PythonShell.run()` executes `imagefunctions.py` with the specified arguments.
4.  **Response**: The server immediately responds with a link to the encoded file, which the user can then download.

## The Core Logic: Python in Action

Now, let's dive into the Python scripts that perform the steganography and cryptography.

### `Cryptography.py`: Securing the Message

Before hiding the message, it's encrypted. This ensures that even if someone extracts the hidden data, they can't read it without the password.

```python
# C:\Users\sayan\Documents\Work\sidegigs\stegimage\Stegimage\StegImage\uploads\Crytpography.py
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.fernet import Fernet, InvalidToken

def key_gen(password):
    password_provided = password
    password = password_provided.encode()
    salt = b'salt_' # IMPORTANT: This should be unique and stored securely
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = base64.urlsafe_b64encode(kdf.derive(password))
    return key

def encoding(message, password):
    key = key_gen(password)
    f = Fernet(key)
    encrypted = f.encrypt(message.encode())
    return encrypted.decode()

def decoding(message, password):
    key = key_gen(password)
    f = Fernet(key)
    try:
        decrypted = f.decrypt(message.encode())
        return decrypted.decode()
    except InvalidToken:
        return 'Invalid Password'
```

The script uses the `cryptography` library to perform Fernet (symmetric) encryption. A key is derived from the user's password using `PBKDF2HMAC`.

**Security Note**: The `salt` is hardcoded in this script. In a production application, you should generate a unique salt for each encryption and store it alongside the encrypted message.

### `imagefunctions.py`: Hiding Data in Pixels

This script uses the **Least Significant Bit (LSB)** technique. The idea is to alter the last bit of each color component (Red, Green, Blue) of a pixel to store a bit of the secret message. Since changing the LSB results in a very minor change to the color, the modification is imperceptible to the human eye.

The `modPix` function is the heart of this process:

```python
# C:\Users\sayan\Documents\Work\sidegigs\stegimage\Stegimage\StegImage\uploads\imagefunctions.py
# Pixels are modified according to the 8-bit binary data
def modPix(pix, data):
    datalist = genData(data) # Convert message to binary
    lendata = len(datalist)
    imdata = iter(pix)

    for i in range(lendata):
        # Extracting 3 pixels (9 values) at a time
        pix = [value for value in imdata.__next__()[:3] +
                                  imdata.__next__()[:3] +
                                  imdata.__next__()[:3]]

        # Modify the LSB of the first 8 pixel values
        for j in range(0, 8):
            if (datalist[i][j] == '0' and pix[j] % 2 != 0):
                pix[j] -= 1
            elif (datalist[i][j] == '1' and pix[j] % 2 == 0):
                if (pix[j] != 0):
                    pix[j] -= 1
                else:
                    pix[j] += 1

        # The 9th pixel value is a stop indicator
        # 1 means message is over, 0 means keep reading
        if (i == lendata - 1):
            if (pix[-1] % 2 == 0):
                pix[-1] += 1 # Make it odd to signal end
        else:
            if (pix[-1] % 2 != 0):
                pix[-1] -= 1 # Make it even to signal continuation

        pix = tuple(pix)
        yield pix[0:3]
        yield pix[3:6]
        yield pix[6:9]
```

### `AudioEncoder.py` & `AudioDecoder.py`: Hiding Data in Sound

The same LSB technique is applied to audio files. A WAV audio file is essentially a long sequence of bytes representing the sound wave's amplitude. The script modifies the LSB of each byte in the audio file to hide the secret message.

Here's a snippet from `AudioEncoder.py`:

```python
# C:\Users\sayan\Documents\Work\sidegigs\stegimage\Stegimage\StegImage\uploads\AudioEncoder.py
# Read frames and convert to byte array
frame_bytes = bytearray(list(song.readframes(song.getnframes())))

# Convert text to bit array
bits = list(map(int, ''.join([bin(ord(i)).lstrip('0b').rjust(8,'0') for i in string])))

# Replace LSB of each byte of the audio data by one bit from the text bit array
for i, bit in enumerate(bits):
    frame_bytes[i] = (frame_bytes[i] & 254) | bit

# Get the modified bytes
frame_modified = bytes(frame_bytes)

# Write bytes to a new wave audio file
with wave.open(carrier_dest + 'enc' + carrier_audio, 'wb') as fd:
    fd.setparams(song.getparams())
    fd.writeframes(frame_modified)
```

## Conclusion and Future Improvements

StegImage is a well-structured application that provides a solid foundation for exploring steganography. The combination of Node.js and Python works effectively, playing to the strengths of each language.

While the project is functional, here are a few ways it could be enhanced:

*   **Dynamic Salt**: Implement a system to generate and store a unique salt for each encrypted message to improve security.
*   **Error Handling**: Add more robust error handling on both the frontend and backend to provide clearer feedback to the user (e.g., "Invalid Password", "File too small").
*   **Broader File Support**: Extend the application to support more image (PNG, BMP) and audio formats.
*   **UI/UX**: Enhance the frontend with features like progress bars for file uploads and a more polished design.

This deep dive into StegImage reveals the fascinating intersection of web development, data manipulation, and cryptography. It's a perfect project for anyone looking to understand how different technologies can be woven together to create something truly unique. Happy hiding!
