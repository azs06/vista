// This is a simple JavaScript library that allows for reactive data binding, inspired by Vue.js 0.11

function Vista(element, initialData) {
  // Save a reference to the container element and capture the original template.
  this.$el = element;
  this.template = element.innerHTML;

  // Create a shallow copy of the initial data.
  const data = { ...initialData };
  const self = this;

  // Render function that replaces double-curly placeholders with data values.
  const render = (template, passedData) => {
    // The regex replaces all occurrences of {{ key }} with its value from passedData.
    return template.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
      return passedData[key] !== undefined ? passedData[key] : '';
    });
  };

  // Update the view by re-rendering the template with the current data
  // and re-binding event listeners.
  const updateView = () => {
    self.$el.innerHTML = render(self.template, data);
    // Reinitialize events on new DOM elements since innerHTML replacement loses previous listeners.
    initEvents();
  };

  // Create a reactive proxy for the data object.
  const setupProxy = (target) => {
    return new Proxy(target, {
      get(obj, prop) {
        return obj[prop];
      },
      set(obj, prop, value) {
        obj[prop] = value;
        updateView(); // Re-render the view whenever data changes.
        return true;
      }
    });
  };

  // Initialize DOM event bindings.
  // This includes two-way binding for inputs with attribute "bind:value"
  // and basic event bindings for elements with directives like "vista-on:click".
  const initEvents = () => {
    // Two-way binding for inputs.
    const boundInputs = self.$el.querySelectorAll('[bind\\:value]');
    boundInputs.forEach(input => {
      const bindProp = input.getAttribute('bind:value');
      input.removeAttribute('bind:value');
      // Set the input's value from the current data.
      input.value = data[bindProp] || '';
      // Update the model when the user types in the input.
      input.addEventListener('input', function(e) {
        self.$data[bindProp] = e.target.value;
      });
    });
    
    // Basic click event binding.
    // For elements with a vista-on:click attribute, expect a method name that should be called on click.
    const boundEvents = self.$el.querySelectorAll('[vista-on\\:click]');
    boundEvents.forEach(el => {
      const methodName = el.getAttribute('vista-on:click');
      el.removeAttribute('vista-on:click');
      // If a method is defined on the Vista instance, bind it to the element.
      if (typeof self[methodName] === 'function') {
        el.addEventListener('click', self[methodName].bind(self));
      }
    });
  };

  // Assign reactive data proxy to the instance.
  this.$data = setupProxy(data);

  // Expose each property of initialData directly on the instance for easier access.
  Object.keys(initialData).forEach(key => {
    Object.defineProperty(this, key, {
      get: () => self.$data[key],
      set: (value) => { self.$data[key] = value; }
    });
  });

  // Initial render.
  updateView();

  return this;
}

/*
  Vista.prototype.method for attaching custom methods to the instance.
*/
Vista.prototype.method = function(methodName, callback) {
  this[methodName] = callback.bind(this);
};

// ----------------- Usage Example -----------------

// <div id="app">
//   <p>{{msg}}</p>
//   <input type="text" bind:value="msg" />
//   <button vista-on:click="changeMsg">Change Message</button>
// </div>

// Create a new Vista instance with initial data.
const app = new Vista(document.getElementById('app'), {
  msg: "Hello"
});

// Adding a custom method called 'changeMsg' that updates the message.
app.method('changeMsg', function() {
  this.msg = "Hello World!";
});

console.log(app);
