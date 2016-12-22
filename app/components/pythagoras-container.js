import Ember from 'ember';
import d3Selection from 'npm:d3-selection';
import d3Scale from 'npm:d3-scale';

const { Component, computed, String: { htmlSafe }, run } = Ember;
const { select: d3select, mouse: d3mouse } = d3Selection;
const { scaleLinear } = d3Scale;

export default Component.extend({
  tagName: 'svg',

  attributeBindings: ['width', 'height', 'style'],

  style: htmlSafe('border: 1px solid lightgray'),
  width: 1280,
  height: 600,

  // state
  currentMax: 0,
  baseW: 80,
  heightFactor: 0,
  lean: 0,

  realMax: 11,

  didInsertElement() {
    this._super(...arguments);
    d3select(this.element).on('mousemove', run.bind(this, this.onMouseMove));
    this.next();
  },

  next() {
    let currentMax = this.get('currentMax');

    if (currentMax < this.realMax) {
      this.incrementProperty('currentMax');
      run.later(() => this.next(), 500);
    }
  },

  onMouseMove() {
    if (this.running) {
      return;
    }

    this.running = true;

    let [x, y] = d3mouse(this.element);

    let scaleFactor = scaleLinear().domain([this.get('height'), 0]).range([0, 0.8]);

    let scaleLean = scaleLinear().domain([0, this.get('width') / 2, this.get('width')]).range([0.5, 0, -0.5]);

    this.setProperties({
      heightFactor: scaleFactor(y),
      lean: scaleLean(x)
    });

    this.running = false;
  },

  initialX: computed('width', function() {
    return this.get('width') / 2 - 40;
  }),

  initialY: computed('height', 'baseW', function() {
    return this.get('height') - this.get('baseW');
  })
});
