const lSet = (key,value)=>localStorage.setItem(key,value)
const lGet = (key)=>localStorage.getItem(key)
const getId = (id)=>document.getElementById(id)
const QS = (q)=>document.querySelector(q)
const QSA = (q)=>[...document.querySelectorAll(q)]
const eachElement = (selector, fn) => {
    document.querySelectorAll(selector).forEach(item=>fn(item));
  };
