const savePixels = require('save-pixels');
const getPixels = require('get-pixels');
const {promisify} = require('util');
const fs = require('fs');
const path = require('path');


const promisedGetPixels = promisify(getPixels);


const cropImage = async (imagePath, imageOutput, [top, right, bottom, left]) => {
    const pixels = await promisedGetPixels(imagePath);

    savePixels(
        pixels.hi(right, bottom).lo(left, top),
        path.extname(imageOutput),
    ).pipe(fs.createWriteStream(imageOutput));
};


module.exports = {
    cropImage,
};
