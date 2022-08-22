import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'

function Vista(element, initalData){
  const el = this.$el = element;
  const data = this.$data = {...initalData};
  const htmlContent = render(el.innerHtml, data);
  el.innerHtml = htmlContent;
  
  const render = (template, passedData) => {
    return template.replace(/{{(.*?)}}/g, (match) => {
      const matchedArray = match.split(/{{|}}/).filter(Boolean);
      return passedData[matchedArray[0]] || match;
    });
  };


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
