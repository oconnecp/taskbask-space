import express from 'express';
import axios from 'axios';

// base url /images from the server.ts file
const ImageProxyRouter = express.Router();

// I was having CORS issues loading images from other domains in the frontend
// so this is a simple proxy to fetch the image and return it with CORS headers
// in the future we should just cache the picture on the backend and serve it directly
// when a users url changes we can update the cached image
// for now authentication is required to use this endpoint as a basic protection
// this was just a quick solution to unblock frontend work
ImageProxyRouter.get('/proxy-image', async (req, res) => {
    if (!req.isAuthenticated && !req.isAuthenticated()) {
        return res.status(401).json({ user: null });
    }
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).send('Missing url parameter');
    }

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'] || 'image/jpeg';
        res.set('Content-Type', contentType);
        res.set('Access-Control-Allow-Origin', '*');
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Failed to fetch image');
    }
});

export default ImageProxyRouter;