const createOrder = function(order) {
    getUser((k,...args)=>{
        meta = k.user_metadata
        if(!meta)meta = {}
        if(!meta.orders)meta.orders = []
        meta.orders.push(order)
        mgmt.patchUserMetadata(user.sub,meta,(err,res)=>{
            if(err)console.log(err)
            console.log(res)
        })
    },order)
}


const validateOrder =async () => {
    items = await JSON.parse(lGet('cart'));
    console.log('validate order', items)
    if(!items || items.length == 0){
        return false;
    }
    if(!user.email_verified){
        document.getElementById('cart-errors').innerHTML = 'Please verify your email before placing an order';
        return false;
    }
    address1 = document.getElementById('address-1').value
    address2 = document.getElementById('address-2').value
    addresszip = document.getElementById('address-zip').value
    addressstate = document.getElementById('address-state').value
    order = {}
    order.items = JSON.stringify(items)
    order.address1 = address1
    order.address2 = address2
    order.addresszip = addresszip
    order.addressstate = addressstate
    order.total = items.reduce((acc, item) => acc + item.price, 0)
    order.delivery = DELIVERYCHARGE
    try{
        const response = await fetch("/api/time");
        const responseData = await response.json();
        otime = responseData.time
    }catch(e){
        console.log(e)
        otime = new Date().toISOString()
    }
    order.time = otime
    createOrder(order)
}

const addToCart = (item) => {
    CART = JSON.parse(lGet('cart'))
    if(!CART)CART = []
    console.log('add to cart', item)
    CART.push(JSON.parse(item))
    lSet('cart', JSON.stringify(CART))
    render_cart(CART)
}

const removeFromCart =async (itemid) => {
    CART = await JSON.parse(lGet('cart'))
    idx = CART.findIndex((i) => i.id == itemid)
    console.log('remove from cart', idx)
    if (idx > -1) {
        CART.splice(idx, 1);
    }
    await lSet('cart', JSON.stringify(CART))
    render_cart(CART)
}

const showOrderDetails = (order) => {
    console.log(order)
}