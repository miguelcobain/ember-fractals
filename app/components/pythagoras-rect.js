import Ember from 'ember';
import d3Scale from 'npm:d3-scale';
import memoizedCalc from '../utils/memoized-calc';

const { Component, computed, String: { htmlSafe } } = Ember;
const { interpolateViridis } = d3Scale;

export default Component.extend({
  tagName: '',

  result: computed('w', 'heightFactor', 'lean', function() {
    let args = this.getProperties('w', 'heightFactor', 'lean');
    return memoizedCalc(args);
  }),

  nextRight: computed.readOnly('result.nextRight'),
  nextLeft: computed.readOnly('result.nextLeft'),
  A: computed.readOnly('result.A'),
  B: computed.readOnly('result.B'),

  transformStyle: computed('x', 'y', 'left', 'right', 'w', 'A', 'B', function() {
    let { x, y, left, right, w, A, B } = this.getProperties('x', 'y', 'left', 'right', 'w', 'A', 'B');
    let rotate = '';

    if (left) {
      rotate = `rotate(${-A} 0 ${w})`;
    } else if (right) {
      rotate = `rotate(${B} ${w} ${w})`;
    }

    return `translate(${x} ${y}) ${rotate}`;
  }),

  squareFillStyle: computed('lvl', 'maxlvl', function() {
    let { lvl, maxlvl } = this.getProperties('lvl', 'maxlvl');
    return htmlSafe(`fill: ${interpolateViridis(lvl / maxlvl)}`);
  }),

  nextXLeft: 0,
  nextYLeft: computed('nextLeft', function() {
    return -this.get('nextLeft');
  }),

  nextXRight: computed('w', 'nextRight', function() {
    let { w, nextRight } = this.getProperties('w', 'nextRight');
    return w - nextRight;
  }),

  nextYRight: computed('nextRight', function() {
    return -this.get('nextRight');
  }),

  nextLvl: computed('lvl', function() {
    return this.get('lvl') + 1;
  }),

  shouldRender: computed('lvl', 'w', 'maxlvl', function() {
    let { lvl, w, maxlvl } = this.getProperties('lvl', 'w', 'maxlvl');
    return lvl < maxlvl && w >= 1;
  })

});
