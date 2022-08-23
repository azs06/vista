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

  const htmlContent = render(el.innerHTML, data);
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
  items: [1, 2, 3, 4]
})
console.log(app);
