
export default (num) => {
    var minutes = 0;
    var seconds = 0;

    num = Math.floor(num / 1000);

    minutes = ('0' + Math.floor(num / 60)).slice(-2);
    seconds = ('0' + num % 60).slice(-2);

    return { minutes, seconds };
};
