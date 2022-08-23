import './style.css'

function Vista(element, initalData){
  const el = element;
  const data = {...initalData};
  this.$el = element;
  this.$data = setupProx(initalData);
  const htmlContent = render(el.innerHtml, data);
  el.innerHtml = htmlContent;

  const render = (template, passedData) => {
    return template.replace(/{{(.*?)}}/g, (match) => {
      const matchedArray = match.split(/{{|}}/).filter(Boolean);
      return passedData[matchedArray[0]] || match;
    });
  };


  const setupProx = (target) =>{
    const handler = {
      get(target, prop, receiver){
        return Reflect.get(...arguments);
      },
      set(obj, prop, value){
        if(obj && obj[prop]){
          Reflect.set(obj, prop, value)
          if(el){
            el.innerHtml = render(el.innerHtml, target);
          }
        }
      }
    }
    return this.$data;
  }
  /* 
    need to make object reactive
    on the data change, have to change html
  */

  if(data){
    for(var key in data){
      this[key] = data[key];
    }
  }

  return new Proxy(this);
}

const app = new Vista(document.getElementById('app'), {
  msg: "Hello",
  items: [1, 2, 3, 4]
})
console.log(app);
//setupCounter(document.querySelector('#counter'))
