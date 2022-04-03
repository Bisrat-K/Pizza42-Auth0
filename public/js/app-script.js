const indicator = QS("[data-indicator]")
const secid = [
  getId('s0'),
  getId('s1'),
  getId('s2'),
  getId('s3'),
  getId('s4')
]
const allAnchors = QSA(".navbar-list a")
const navbar = getId('bottomnav')

function updateSection(anchor=null){
  if(anchor){
    index = allAnchors.indexOf(anchor)
  }
  else{
    index = lGet('activeSection')
    if(!index){
      index = 0;
    }
  }
  console.log('Update Section',index)
  lSet('activeSection',index)
  index = parseInt(index)
  indicator.style.setProperty("--position", index)
  secid.forEach((item, i)=>{
    if(i==index){
      item.removeAttribute('hidden')
    }else{
      item.setAttribute('hidden',true)
    }
  })
  allAnchors.forEach((item,i)=>{
    if(i==index){
      item.classList.add('active')
    }else{
      item.classList.remove('active')
    }
  })
}

navbar.addEventListener("click", e => {
  let anchor
  if (e.target.matches(".navbar-list a")) {
    anchor = e.target
  } else {
    anchor = e.target.closest(".navbar-list a")
  }
  if (anchor != null) {
    updateSection(anchor)
  }
})

window.addEventListener('load',()=>{
  updateSection();
})