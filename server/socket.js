let io;

const setIO = (socketIO) => {
    io = socketIO;
};

const getIO = () => {
    return io;
};

module.exports = {
    setIO,
    getIO
};