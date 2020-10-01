const getPixels = require('get-pixels');
const {promisify} = require('util');

const promisedGetPixels = promisify(getPixels);

const checkPixel = (data, start, snap) => {
    const colsCnt = snap.length;

    for (let i = 0; i < colsCnt; i++) {
        if (data[start + i] !== snap[i]) {
            return false;
        }
    }

    return true;
};

const checkColumn = (data, columnStart, rowSize, startPixel, [topEdge, bottomEdge]) => {
    const rowsEnd = bottomEdge * rowSize;

    let currentColStart = columnStart + topEdge * rowSize;

    while (currentColStart < rowsEnd) {
        if (!checkPixel(data, currentColStart, startPixel)) return false;

        currentColStart += rowSize;
    }

    return true;
};

const checkRow = (data, rowStart, rowSize, startPixel) => {
    const rowEnd = rowStart + rowSize;
    const pixelSize = startPixel.length;

    let currentPixelStart = rowStart;

    while (currentPixelStart < rowEnd) {
        if (!checkPixel(data, currentPixelStart, startPixel)) return false;

        currentPixelStart += pixelSize;
    }

    return true;
};

const getBottomRightPixel = (data, pixelSize) =>
    data.slice(data.length - pixelSize);

const getLeftTopPixel = (data, pixelSize) =>
    data.slice(0, pixelSize);

const getRowsBounds = (data, rowSize, pixelSize) => {
    const rowsCount = data.length / rowSize;

    const leftStartPixel = getLeftTopPixel(data, pixelSize);
    const rightStartPixel = getBottomRightPixel(data, pixelSize);

    let start = 0;
    while (start < rowsCount && checkRow(data, start * rowSize, rowSize, leftStartPixel)) {
        start++;
    }

    let end = rowsCount - 1;
    while (end > start && checkRow(data, end * rowSize, rowSize, rightStartPixel)) {
        end--;
    }

    return [start, end];
};

const getColsBounds = (data, rowSize, pixelSize, rowBounds) => {
    const columnsCount = rowSize / pixelSize;

    const rightBottomPixel = getBottomRightPixel(data, pixelSize);

    let start = 0;
    while (start < columnsCount && checkColumn(
        data,
        start * pixelSize,
        rowSize,
        rightBottomPixel,
        rowBounds,
    )) {
        start++;
    }

    let end = columnsCount - 1;
    while (end >= 0 && checkColumn(
        data,
        end * pixelSize,
        rowSize,
        rightBottomPixel,
        rowBounds,
    )) {
        end--;
    }

    return [start, end];
};

const getTrimDimensions = async (entry) =>  {
    const {shape, data} = await promisedGetPixels(entry);

    // eslint-disable-next-line no-unused-vars
    const [colsCount, _, pixelSize] = shape;

    const rowSize = colsCount * pixelSize;

    const [top, bottom] = getRowsBounds(data, rowSize, pixelSize);
    const [left, right] = getColsBounds(data, rowSize, pixelSize, [top, bottom]);

    const baseImageCenter = colsCount >> 1;

    if (right - baseImageCenter > baseImageCenter - left) {
        const newLeftEdge = baseImageCenter - (right - baseImageCenter);
        return [top, right, bottom, newLeftEdge];
    }

    const newRightEdge = baseImageCenter + (baseImageCenter - left);
    return [top, newRightEdge, bottom, left];
};


module.exports = {
    getTrimDimensions,
};
