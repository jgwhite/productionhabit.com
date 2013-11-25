Element.addMethods({
  backgroundX: function(element) {
    if (element.currentStyle) {
      var x = parseInt(element.currentStyle['backgroundPositionX'], 10);
    } else {
      var match = element.getStyle('background-position').match(/(\d+)px \d+px/);
      if (match) {
        var x = parseInt(match[1], 10);
      } else {
        var x = 0;
      }
    }
    if (isNaN(x)) x = 0;
    return x;
  }
});

ProductionHabit = {};

ProductionHabit.Animator = Class.create({

  initialize: function(element) {
    this.element = $(element);
    var settings = ProductionHabit.Settings[this.element.identify()];
    this.setFrameCount(settings.frameCount);
    this.setFrameRate(settings.frameRate);
    this._animationInterval = null;
    try {
      this._backgroundX = this.element.backgroundX();
    } catch (e) {
      this._backgroundX = 0;
    }

    this.reset();
  },

  reset: function() {
    this._animationPosition = -1;
    this.updateAnimation();
  },
  startAnimation: function(delay) {
    if (this._animationInterval !== null) return;
    if (delay !== undefined) {
      this.startAnimation.bind(this).delay(delay);
      return;
    }
    var self = this;
    var func = function() { self.updateAnimation.apply(self, arguments) };
    this._animationInterval = window.setInterval(func, this.calculateAnimationInterval());
  },
  stopAnimation: function() {
    window.clearInterval(this._animationInterval);
    this._animationInterval = null;
  },
  setFrameCount: function(value) {
    this._animatorFrameCount = value;
  },
  setFrameRate: function(value) {
    this._animatorFrameRate = value;
  },
  setHeight: function(value) {
    this._height = value;
  },
  getHeight: function() {
    return this._height || this.element.getHeight();
  },
  updateAnimation: function() {
    var i = this._animationPosition + 1;
    var n = this._animatorFrameCount;

    this._animationPosition = (n + (i % n)) % n;

    var y = this._animationPosition * this.getHeight();

    this.element.setStyle({ 'backgroundPosition': this._backgroundX + 'px -' + y + 'px' });
  },
  calculateAnimationInterval: function() {
    return 1000 / this._animatorFrameRate;
  },
  gotoFrame: function(frame) {
    this._animationPosition = frame - 1;
    this.updateAnimation();
  }

});

ProductionHabit.MainView = Class.create({

  activate: function() {
    $(document.documentElement).addClassName('active');
  },

  element: function() {
    return $(document.body);
  },

  build: function() {
    window.moveTo(0, 1);
    window.resizeTo(screen.width, screen.height);

    this.sceneView = new ProductionHabit.SceneView();
    this.element().insert(this.sceneView.element());

    this.contactButtonAnimator = new ProductionHabit.Animator('contact-button');
    this.contactButtonAnimator.startAnimation();
    this.aboutButtonAnimator = new ProductionHabit.Animator('about-button');
    this.aboutButtonAnimator.startAnimation();

    this.prevButton = new Element('a', { 'href': '#scene-prev', 'class': 'arrow arrow-prev', 'id': 'arrow-prev' });
    this.prevButton.update('Previous');
    this.element().insert(this.prevButton);
    this.prevButtonAnimator = new ProductionHabit.Animator(this.prevButton);
    this.prevButtonAnimator.startAnimation();
    this.nextButton = new Element('a', { 'href': '#scene-next', 'class': 'arrow arrow-next', 'id': 'arrow-next' });
    this.nextButton.update('Next');
    this.element().insert(this.nextButton);
    this.nextButtonAnimator = new ProductionHabit.Animator(this.nextButton);
    this.nextButtonAnimator.startAnimation(0.1);

    this.contactView = $('contact');
    this.aboutView = $('about');
  }

});

ProductionHabit.SceneView = Class.create({

  initialize: function() {
    this.logo = new Element('div', { 'id': 'scene-logo' });
    this.logoText = new Element('div', { 'id': 'scene-logo-text' });
    this.logoArrow = new Element('div', { 'id': 'scene-logo-arrow' });
    this.logoCircles = new Element('div', { 'id': 'scene-logo-circles' });
    this.logoTriangle = new Element('div', { 'id': 'scene-logo-triangle' });
    this.logo.insert(this.logoText);
    this.logo.insert(this.logoArrow);
    this.logo.insert(this.logoCircles);
    this.logo.insert(this.logoTriangle);
    this.logoArrowAnimator = new ProductionHabit.Animator(this.logoArrow);
    this.logoCirclesAnimator = new ProductionHabit.Animator(this.logoCircles);
    this.logoTriangleAnimator = new ProductionHabit.Animator(this.logoTriangle);
    this.circles = new Element('div', { 'id': 'scene-circles' });
    this.circlesAnimator = new ProductionHabit.Animator(this.circles);
    this.habit = new Element('div', { 'id': 'scene-habit' });

    this.logoArrowAnimator.setHeight(123);
    this.logoArrowAnimator.reset();
    this.logoArrowAnimator.startAnimation(0);
    this.logoCirclesAnimator.setHeight(123);
    this.logoCirclesAnimator.reset();
    this.logoCirclesAnimator.startAnimation(0.11);
    this.logoTriangleAnimator.setHeight(123);
    this.logoTriangleAnimator.reset();
    this.logoTriangleAnimator.startAnimation(0.22);
  },

  element: function() {
    return this._element = this._element || new Element('div', { 'class': 'scene-view', 'id': 'scene-view' });
  },

  stopAnimators: function() {
    // [ this.circlesAnimator ].invoke('stopAnimation');
  },

  sceneOne: function() {
    this.stopAnimators();
    this.element().update('');
    this.element().insert(this.logo);
  },
  sceneTwo: function() {
    this.stopAnimators();
    try { this.circles.remove() } catch(e) {}
    try { this.habit.remove() } catch(e) {}
    try { this.logo.remove() } catch(e) {}
    this.element().insert(this.circles);
    this.circlesAnimator.gotoFrame(0);
  },
  sceneThree: function() {
    this.stopAnimators();
    try { this.circles.remove() } catch(e) {}
    try { this.habit.remove() } catch(e) {}
    try { this.logo.remove() } catch(e) {}
    this.element().insert(this.circles);
    this.circlesAnimator.gotoFrame(1);
  },
  sceneFour: function() {
    this.stopAnimators();
    try { this.circles.remove() } catch(e) {}
    try { this.habit.remove() } catch(e) {}
    try { this.logo.remove() } catch(e) {}
    this.element().insert(this.circles);
    this.circlesAnimator.gotoFrame(2);
  },
  sceneFive: function() {
    this.stopAnimators();
    try { this.circles.remove() } catch(e) {}
    try { this.habit.remove() } catch(e) {}
    try { this.logo.remove() } catch(e) {}
    this.element().insert(this.habit);
  },
  sceneSix: function() {
    this.stopAnimators();
    try { this.circles.remove() } catch(e) {}
    try { this.habit.remove() } catch(e) {}
    try { this.logo.remove() } catch(e) {}
    this.element().insert(this.logo);
  }

});

ProductionHabit.ApplicationController = Class.create({

  initialize: function() {
    this.onClick = this.onClick.bind(this);
    $(document.body).observe('click', this.onClick);
    $(document.body).observe('mouseover', this.onMouseover);
  },

  onClick: function(event) {
    var a = event.findElement('a');
    if (!a) return;

    switch (a.readAttribute('href')) {
    case '#contact-close':
      ProductionHabit.mainView.contactView.toggleClassName('visible');
      ProductionHabit.mainView.aboutView.removeClassName('visible');
      break;
    case '#about-close':
      ProductionHabit.mainView.contactView.removeClassName('visible');
      ProductionHabit.mainView.aboutView.toggleClassName('visible');
      break;
    case '#scene-prev':
      ProductionHabit.sceneController.prev();
      break;
    case '#scene-next':
      ProductionHabit.sceneController.next();
      break;
    default:
      return true;
    }

    event.stop();
  },

  onMouseover: function(event) {
    var a = event.findElement('a');
    if (!a) return;

    switch (a.readAttribute('href')) {
    case '#contact':
      ProductionHabit.mainView.contactView.addClassName('visible');
      ProductionHabit.mainView.aboutView.removeClassName('visible');
      break;
    case '#about':
      ProductionHabit.mainView.contactView.removeClassName('visible');
      ProductionHabit.mainView.aboutView.addClassName('visible');
      break;
    default:
      return true;
    }

    event.stop();
  }

});

ProductionHabit.SceneController = Class.create({

  initialize: function() {
    for (var method in this.constructor.prototype) this[method] = this[method].bind(this);
  },

  begin: function() {
    this.sceneIntro();
  },

  sceneIntro: function() {
    window.clearTimeout(this._timeout);
    this.prev = this.sceneFive;
    this.next = this.sceneTwo;
    this._timeout = this.next.delay(1);
  },

  sceneOne: function() {
    window.clearTimeout(this._timeout);
    this.prev = this.sceneFive;
    this.next = this.sceneTwo;
    ProductionHabit.mainView.sceneView.sceneOne();
    ProductionHabit.mainView.contactButtonAnimator.stopAnimation();
    ProductionHabit.mainView.aboutButtonAnimator.stopAnimation();
    this._timeout = this.next.delay(3);
  },
  sceneTwo: function() {
    window.clearTimeout(this._timeout);
    this.prev = this.sceneSix;
    this.next = this.sceneThree;
    ProductionHabit.mainView.sceneView.sceneTwo();
    ProductionHabit.mainView.contactButtonAnimator.startAnimation();
    ProductionHabit.mainView.aboutButtonAnimator.startAnimation();
    this._timeout = this.next.delay(0.7);
  },
  sceneThree: function() {
    window.clearTimeout(this._timeout);
    this.prev = this.sceneTwo;
    this.next = this.sceneFour;
    ProductionHabit.mainView.sceneView.sceneThree();
    ProductionHabit.mainView.contactButtonAnimator.startAnimation();
    ProductionHabit.mainView.aboutButtonAnimator.startAnimation();
    this._timeout = this.next.delay(0.7);
  },
  sceneFour: function() {
    window.clearTimeout(this._timeout);
    this.prev = this.sceneThree;
    this.next = this.sceneFive;
    ProductionHabit.mainView.sceneView.sceneFour();
    ProductionHabit.mainView.contactButtonAnimator.startAnimation();
    ProductionHabit.mainView.aboutButtonAnimator.startAnimation();
    this._timeout = this.next.delay(0.7);
  },
  sceneFive: function() {
    window.clearTimeout(this._timeout);
    this.prev = this.sceneFour;
    this.next = this.sceneSix;
    ProductionHabit.mainView.sceneView.sceneFive();
    ProductionHabit.mainView.contactButtonAnimator.startAnimation();
    ProductionHabit.mainView.aboutButtonAnimator.startAnimation();
    this._timeout = this.next.delay(0.7);
  },
  sceneSix: function() {
    window.clearTimeout(this._timeout);
    this.prev = this.sceneThree;
    this.next = this.sceneTwo;
    ProductionHabit.mainView.sceneView.sceneSix();
    ProductionHabit.mainView.contactButtonAnimator.stopAnimation();
    ProductionHabit.mainView.aboutButtonAnimator.stopAnimation();
    this._timeout = this.next.delay(3);
  }

});

ProductionHabit.Settings = {
  'contact-button'      : { frameCount : 3, frameRate : 3.75 },
  'about-button'        : { frameCount : 3, frameRate : 3.75 },
  'scene-logo-arrow'    : { frameCount : 3, frameRate : 3, delay : 0 },
  'scene-logo-circles'  : { frameCount : 3, frameRate : 3, delay : 0.1 },
  'scene-logo-triangle' : { frameCount : 3, frameRate : 3, delay : 0.2 },
  'scene-circles'       : { frameCount : 3, frameRate : 1 },
  'arrow-prev'          : { frameCount : 3, frameRate : 3 },
  'arrow-next'          : { frameCount : 3, frameRate : 3 }
}

ProductionHabit.activate = function() {
  ProductionHabit.mainView = new ProductionHabit.MainView();
  ProductionHabit.mainView.activate();
}

ProductionHabit.build = function() {
  ProductionHabit.mainView.build();

  ProductionHabit.applicationController = new ProductionHabit.ApplicationController();
  ProductionHabit.sceneController = new ProductionHabit.SceneController();
  ProductionHabit.sceneController.begin();
}

ProductionHabit.activate();
