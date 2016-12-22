import Ember from 'ember';
import d3Scale from 'npm:d3-scale';
import memoizedCalc from '../utils/memoized-calc';

const { Component, computed, String: { htmlSafe } } = Ember;
const { interpolateViridis } = d3Scale;

export default Component.extend({
  tagName: '',

  didReceiveAttrs() {
    this._super(...arguments);
    let args = this.getProperties('w', 'heightFactor', 'lean');
    let vars = memoizedCalc(args);

    this.setProperties(vars);
    this.computeTransformStyle();
    this.computeSquareFillStyle();
    this.computeNextYLeft();
    this.computeNextXRight();
    this.computeNextYRight();
    this.computeNextLvl();
    this.computeShouldRender();
  },

  computeTransformStyle() {
    let { x, y, left, right, w, A, B } = this.getProperties('x', 'y', 'left', 'right', 'w', 'A', 'B');
    let rotate = '';

    if (left) {
      rotate = `rotate(${-A} 0 ${w})`;
    } else if (right) {
      rotate = `rotate(${B} ${w} ${w})`;
    }

    this.set('transformStyle', `translate(${x} ${y}) ${rotate}`);
  },

  computeSquareFillStyle() {
    let { lvl, maxlvl } = this.getProperties('lvl', 'maxlvl');
    this.set('squareFillStyle', htmlSafe(`fill: ${interpolateViridis(lvl / maxlvl)}`));
  },

  nextXLeft: 0,
  computeNextYLeft() {
    this.set('nextYLeft', -this.get('nextLeft'));
  },

  computeNextXRight() {
    let { w, nextRight } = this.getProperties('w', 'nextRight');
    this.set('nextXRight', w - nextRight);
  },

  computeNextYRight() {
    this.set('nextYRight', -this.get('nextRight'));
  },

  computeNextLvl() {
    this.set('nextLvl', this.get('lvl') + 1);
  },

  computeShouldRender() {
    let { lvl, w, maxlvl } = this.getProperties('lvl', 'w', 'maxlvl');
    this.set('shouldRender', lvl < maxlvl && w >= 1);
  }

});
