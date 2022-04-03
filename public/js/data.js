const PIZZA = [
    {
        'id':1,
        'name':"Margherita Pizza",
        'price':"$ 2",
        'desc':"A hugely popular margherita, with a deliciously tangy single cheese topping",
        'veg':true,
        'max_order':10,
        'sizes':[['small','$ 2'],['medium','$ 3'],['large','$ 4']],
        'img':'/images/pizza1.jpg'
    },
    {
        'id':2,
        'name':"Double Cheese Margherita Pizza",
        'price':"$ 2.50",
        'desc':"The ever-popular Margherita - loaded with extra cheese... oodies of it!",
        'veg':true,
        'max_order':10,
        'sizes':[['small','$ 2'],['medium','$ 3'],['large','$ 4']],
        'img':'/images/pizza1.jpg'
    },
    {
        'id':3,
        'name':"FARM HOUSE",
        'price':"$ 5",
        'desc':"A pizza that goes ballistic on veggies! Check out this mouth watering overload of crunchy, crisp capsicum, succulent mushrooms and fresh tomatoes",
        'veg':true,
        'max_order':10,
        'sizes':[['small','$ 2'],['medium','$ 3'],['large','$ 4']],
        'img':'/images/pizza1.jpg'
    },
    {
        'id':4,
        'name':"CHICKEN SAUSAGE",
        'price':"$ 2.5",
        'desc':"Chicken Sausage | Cheese",
        'veg':false,
        'max_order':10,
        'sizes':[['small','$ 2'],['medium','$ 3'],['large','$ 4']],
        'img':'/images/pizza1.jpg'
    },
    {
        'id':5,
        'name':"CHICKEN GOLDEN DELIGHT",
        'price':"$ 3",
        'desc':"Mmm! Barbeque chicken with a topping of golden corn loaded with extra cheese. Worth its weight in gold!",
        'veg':false,
        'max_order':10,
        'sizes':[['small','$2'],['medium','$3'],['large','$4']],
        'img':'/images/pizza1.jpg'
    },
]
const COUPON = [
    {
        'id':1,
        'title':'Offer 1',
        'desc':'Flat 1$ off',
        'code':'1OFF',
    },
    {
        'id':2,
        'title':'Offer 2',
        'desc':'Flat 0.8$ off',
        'code':'DISCOUNT80',
    },
    {
        'id':3,
        'title':'Offer 3',
        'desc':'Upto 50% off on Food Cards',
        'code':'FOOD123',
    },
    {
        'id':4,
        'title':'Offer 4',
        'desc':'Free Delivery',
        'code':'FREEDEL',
    },
    {
        'id':5,
        'title':'Offer 5',
        'desc':'Pick Up at store to get 10% off',
        'code':'STOREPICK',
    },
]

function render_pizza(items){

    container = document.getElementById('pizzacontainer')
    container.innerHTML = ""
    items.forEach((item,i) => {
        container.innerHTML+=`
          <div class="card mb-4 card-s3" style="max-width: 540px;">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${item['img']}" class="img-fluid rounded-start rounded" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${item['name']}}<span>veg</span></h5>
                  <p class="card-text">${item['desc']}</p>
                  <button class="btn btn-sm btn-success">Add To Cart</button>
                </div>
              </div>
            </div>
            
    <div class="card-footer  mt-auto">
    <button type="button" class="btn" id="left-panel-link">Register</button>
    <button type="button" class="btn" data-toggle="modal" data-target="#exampleModal1" id="right-panel-link">
      Learn More
    </button>
  </div>
          </div>`
    });
}
window.addEventListener('load',()=>{
    render_pizza(PIZZA)
})
