import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'

function Vista(element, initalData){

}

const app = new Vista(document.getElementById('app'), {
  msg: "Hello"
})

//setupCounter(document.querySelector('#counter'))
