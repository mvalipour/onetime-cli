function pad(v, l) {
    v = v || '';
    while(v.length < l) v += ' ';
    return v;
}

module.exports = {
    pad: pad
};
