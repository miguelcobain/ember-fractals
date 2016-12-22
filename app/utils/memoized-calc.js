const deg = function(radians) {
  return radians * (180 / Math.PI);
};

const memoizedCalc = function () {
  let memo = {};

  let key = ({ w, heightFactor, lean }) => [w, heightFactor, lean].join('-');

  return (args) => {
    let memoKey = key(args);

    if (memo[memoKey]) {
      return memo[memoKey];
    } else {
      let { w, heightFactor, lean } = args;

      let trigH = heightFactor * w;

      let result = {
        nextRight: Math.sqrt(Math.pow(trigH, 2) + Math.pow(w * (0.5 + lean), 2)),
        nextLeft: Math.sqrt(Math.pow(trigH, 2) + Math.pow(w * (0.5 - lean), 2)),
        A: deg(Math.atan(trigH / ((0.5 - lean) * w))),
        B: deg(Math.atan(trigH / ((0.5 + lean) * w)))
      };

      memo[memoKey] = result;
      return result;
    }
  };
}();

export default memoizedCalc;