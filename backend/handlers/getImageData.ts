import axios from 'axios';
import { createCanvas, Image } from 'canvas';

const getImageData = async (url: string) => {
    try {
        const axiosResponse = await axios.get(url, {
            responseType: 'arraybuffer',
        });
        const img = new Image();
        img.src = Buffer.from(axiosResponse.data);

        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        console.log(imageData);
    } catch (error) {
        console.error(error);
    }
};

export default getImageData;
