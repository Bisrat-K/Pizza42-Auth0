const indicator = document.querySelector("[data-indicator]")

document.addEventListener("click", e => {
  let anchor
  if (e.target.matches(".navbar-list a")) {
    anchor = e.target
  } else {
    anchor = e.target.closest(".navbar-list a")
  }
  if (anchor != null) {
    const allAnchors = [...document.querySelectorAll(".navbar-list a")]
    const index = allAnchors.indexOf(anchor)
    indicator.style.setProperty("--position", index)
    document.querySelectorAll(".navbar-list a").forEach(elem => {
      elem.classList.remove("active")
    })
    anchor.classList.add("active")
  }
})
// const buttonRight = document.getElementById('slideRight');
// const buttonLeft = document.getElementById('slideLeft');

// buttonRight.onclick = function () {
//   document.getElementById('offercontainer').scrollLeft += 20;
// };
// buttonLeft.onclick = function () {
//   document.getElementById('offercontainer').scrollLeft -= 20;
// };
