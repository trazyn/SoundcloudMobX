
export default (number) => {
    if (number > 1000) {
        return (number / 1000).toFixed(2) + 'K';
    }

    return number;
};
