
export default (number) => {
    var str = '';

    number.toString().split('').reverse().map((e, index) => {
        str += e.toString();

        if ((index + 1) % 3 === 0) {
            str += ',';
        }
    });

    return str.split('').reverse().join('').replace(/^,/, '');
};
