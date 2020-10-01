const path = require('path');

const {getImagesUrls} = require('./getImageUrls');
const {getImageNameFromPhotoFile} = require('./util/getImageNameFromPhotoFile');
const {getTrimDimensions} = require('./util/getTrimDimensions');
const {cropImage} = require('./util/cropImage');


const convertImages = async () => {
    const images = (await getImagesUrls()).map(getImageNameFromPhotoFile);

    images.forEach(image => {
        const inputFile = path.resolve(__dirname, 'resources', image);
        const outputFile = path.resolve(__dirname, 'dist', image);

        getTrimDimensions(inputFile).then(
            dimensions => cropImage(inputFile, outputFile, dimensions),
        );
    });
};

convertImages();

