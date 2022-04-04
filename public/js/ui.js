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

const afterLogin = async () => {
  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");
  if (shouldParseResult) {
    console.log("> Parsing redirect");
    try {
      const result = await auth0.handleRedirectCallback();
      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      }
      console.log("Logged in!");
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }
    window.history.replaceState({}, document.title, "/");
  }
}

const updateProfile = async () => {
  try {
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
      console.log("> User is authenticated");
      const user = await auth0.getUser();

      document.getElementById("profile-data").innerText = JSON.stringify(
        user,
        null,
        2
      );
      eachElement(".profile-image", (e) => (e.src = user.picture));
      eachElement(".user-name", (e) => (e.innerText = user.name));
      eachElement(".user-email", (e) => (e.innerText = user.email));
      eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
      eachElement(".auth-visible", (e) => e.classList.remove("hidden"));
    } else {
      eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
      eachElement(".auth-visible", (e) => e.classList.add("hidden"));
    }
  } catch (err) {
    console.log("Error updating UI!", err);
    return;
  }
  console.log("UI updated");
};

async function updateSection(anchor = null,index=null) {
  if(index==null){
    if (anchor) {
      index = allAnchors.indexOf(anchor)
    }
    else {
      index = lGet('activeSection')
      if (!index) {
        index = 0;
      }
    }
  }
  console.log('Update Section', index)
  lSet('activeSection', index)
  index = parseInt(index)
  indicator.style.setProperty("--position", index)
  secid.forEach((item, i) => {
    if (i == index) {
      item.removeAttribute('hidden')
    } else {
      item.setAttribute('hidden', true)
    }
  })
  allAnchors.forEach((item, i) => {
    if (i == index) {
      item.classList.add('active')
    } else {
      item.classList.remove('active')
    }
  })
  try{
    updateProfile();
  } catch(err){
    console.log(err)
  }
}

document.addEventListener("click", e => {
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

window.addEventListener('load', async () => {
  render_pizza(PIZZA);
  updateSection();
  await configureClient();
  await afterLogin();
  updateProfile();
})



function render_pizza(items) {
  container = document.getElementById('pizzacontainer')
  container.innerHTML = ""
  items.forEach((item, i) => {
    container.innerHTML += `
        <div class="card mb-4 card-s3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${item['img']}" class="img-fluid rounded-start rounded" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${item['name']}</h5>
                <p class="card-text">${item['desc']}</p>
              </div>
            </div>
          </div>
          
          <div class="buttons mt-auto">
            <a class="btn btn-sm" id="left-panel-link">Add to Cart</a>
            <a class="btn btn-sm" id="right-panel-link">Order Now</a>
            ${item['veg']?'<span style="color:green;">▣</span>':'<span style="color:red;">▣</span>'}
          </div>
        </div>`
  });
}

