const lSet = (key,value)=>localStorage.setItem(key,value)
const lGet = (key)=>localStorage.getItem(key)
const getId = (id)=>document.getElementById(id)
const QS = (q)=>document.querySelector(q)
const QSA = (q)=>[...document.querySelectorAll(q)]
const eachElement = (selector, fn) => {
    for (let e of document.querySelectorAll(selector)) {
      fn(e);
    }
  };
