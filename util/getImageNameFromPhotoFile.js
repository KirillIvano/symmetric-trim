// photo file is string with format: /static/img/{imageName}
const getImageNameFromPhotoFile = photoFile =>
    photoFile.split('/').pop();


module.exports = {
    getImageNameFromPhotoFile,
};
