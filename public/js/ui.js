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

const updateProfile = async () => {
    try {
        if (!auth0SPA) {
            eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
            eachElement(".auth-visible", (e) => e.classList.add("hidden"));
            return;
        }
        const isAuthenticated = await auth0SPA.isAuthenticated();
        if (isAuthenticated) {
            console.log("> User is authenticated");
            const user = await auth0SPA.getUser();
            if(!user.email_verified){
                getId('user-text').innerText = 'Please verify your email'
            }else{
                getId('user-text').innerText = "Order a delicious pizza."
            }
            //     getId('user-resend-verification').removeAttribute('hidden')
            //     getId('user-order-pizza').setAttribute('hidden',true)
            // }
            //     getId('user-resend-verification').setAttribute('hidden',true)
            //     getId('user-order-pizza').removeAttribute('hidden')
            // }
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

async function updateSection(anchor = null, index = null) {
    if (index == null) {
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
    try {
        updateProfile();
    } catch (err) {
        console.log(err)
    }
}

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
                    <span class="card-title">$ ${item['price']}</span>
                <p class="card-text">${item['desc']}</p>
              </div>
            </div>
          </div>
          
          <div class="buttons mt-auto">
            <a class="btn btn-sm" id="left-panel-link" onclick='addToCart(JSON.stringify(${JSON.stringify(item)}))'>Add to Cart</a>
            <a class="btn btn-sm" id="right-panel-link" onclick='addToCart(JSON.stringify(${JSON.stringify(item)}));updateSection(null,1)'>Order Now</a>
            ${item['veg'] ? '<span style="color:green;">▣</span>' : '<span style="color:red;">▣</span>'}
          </div>
        </div>`
    });
}


render_cart = async (items=null) => {
    if(!items)return;
    container = document.getElementById('cartcontainer')
    eachElement('.cart-item-count', (e) => e.innerText = items.length)
    container.innerHTML = ''
    total = 0
    eachElement('.cart-delivery',(e)=>e.innerText = items.length>0?'$'+DELIVERYCHARGE:'$0')
    items.forEach((item, i) => {
        container.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mt-3 p-2 cart-items rounded" style="min-width:250px;">
                <div class="d-flex flex-row"><img class="rounded"
                        src="${item['img']}" style="max-width:70px;max-height:50px; height:auto; width: auto;">
                    <div class="ml-2">
                        <span class="font-weight-bold d-block">
                            ${item['name']}&nbsp;
                        </span>
                        <span class="spec">${item['desc'].slice(0,20)}...</span>
                    </div>
                </div>
                <div class="d-flex flex-row align-items-center">
                    <span class="d-block ms-5 font-weight-bold">$${item['price']}</span>
                    <i class="fa fa-trash-o ms-3 text-black-50" onclick='removeFromCart(${item['id']})'></i>
                </div>
            </div>`
            total+=item['price']
    });
    eachElement('.cart-subtotal',(e)=>e.innerText = '$'+total);
    items.length>0?total+=DELIVERYCHARGE:null;
    eachElement('.cart-total',(e)=>e.innerText = '$'+total);
}


var orderModal = new bootstrap.Modal(document.getElementById('order-details-modal'))