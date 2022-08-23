import './style.css'

function Vista(element, initalData){
  const el = element;
  const data = {...initalData};
  this.$el = el.cloneNode(true);

  const render = (template, passedData) => {
    return template.replace(/{{(.*?)}}/g, (match) => {
      const matchedArray = match.split(/{{|}}/).filter(Boolean);
      return passedData[matchedArray[0]] || match;
    });
  };



  function setupProxy(target, template){
    const handler = {
      get(target, prop, receiver){
        return Reflect.get(...arguments);
      },
      set(obj, prop, value){
        if(obj && obj[prop]){
          Reflect.set(obj, prop, value)
          if(el && template){
            el.innerHTML = render(template, target);
          }
        }
      }
    }
    return new Proxy(target, handler)
  }

  function initEvents(){
    const boundInputs = el.querySelectorAll("[bind\\:value]");
    if(boundInputs){
      boundInputs.forEach((boundInput) => {
        const value = boundInput.getAttribute('bind:value');
        boundInput.removeAttribute('bind:value');
        boundInput.setAttribute('value', value);
        boundInput.addEventListener('input', function(e){
          console.log(e.target.value);
        })
        console.log(boundInput);
      })
    }
  }

  /* 
  Adding events, currently adding events not working
  Adding binding event should work
  currently it doesn nothing
  */

  const htmlContent = render(el.innerHTML, data);
  initEvents();
  el.innerHTML = htmlContent;
  this.$data = setupProxy(initalData, this.$el.innerHTML);

  if(data){
    for(var key in data){
      this[key] = data[key];
    }
  }

  return this.$data;
}

const app = new Vista(document.getElementById('app'), {
  msg: "Hello",
})
console.log(app);
