AFRAME.registerSystem('gamestate', {
    // Initial state.
    schema: {
      function: {
        default:'x^2+y^2'
      }
    },
  
    init: function () {
      var initialState = this.initialState;
      var sceneEl = this.el;
      var state = this.data;
  
      if (!initialState) { initialState = state; }
  
      sceneEl.emit('gamestateinitialized', {state: initialState});
  
      /**
       * Application-specific code goes under here! Handlers to transition state.
       */
      registerHandler('increment', function (newState, evt) {
        newState.value++;
        return newState;
      });
  
      // Part of the game state library.
      function registerHandler (eventName, handler) {
        el.addEventListener(eventName, function (param) {
          var newState = handler(AFRAME.utils.extend({}, state), param);
          publishState(eventName, newState);
        });
      }
  
      // Part of the game state library.
      function publishState (event, newState) {
        var oldState = AFRAME.utils.extend({}, state);
        el.setAttribute('gamestate', newState);
        state = newState;
        el.emit('gamestatechanged', {
          event: event,
          diff: AFRAME.utils.diff(oldState, newState),
          state: newState
        });
      }
    }
  });