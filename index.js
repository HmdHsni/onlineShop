const cartIcon = document.querySelector(".cart-icon")
const showResault = document.querySelector(".showResault")
const mybackdrop = document.querySelector(".mybackdrop");
const number = document.querySelector(".number")
const showResaultFooter = document.querySelector(".showResaultFooter")
const cartTotal = document.querySelector(".totla-price")
const cartBtn = document.querySelectorAll(".cart-btn")
const Basketbtn = document.querySelector(".Basketbtn")
const singleproduct = document.querySelector(".single-product")
const showResaultContent = document.querySelector(".showResaultContent")
const numberOfProd = document.querySelector(".NumberOfProd")
const searchInput = document.querySelector(".form-control")
const searchBtn = document.querySelector(".searchBtn")
const modalbody = document.querySelector(".modal-body")
const catalog = document.querySelector(".catalog")
import { productsData } from "./products.js";

let cart = [];
let buttons = [];
let filters = {
    searchItems: "",
}


document.addEventListener('DOMContentLoaded', (e) => {
    //create obj from products & get data 
    const products = new Products()
    const productsData = products.getProducts();
    const ui = new Ui();
    ui.showOnDom(productsData);//show all produts on dom 
    ui.getCartBtn();//create cart and disabled btns
    ui.setUpApp();//save number and total with reload dom
    //save in local storage
    Storage.saveProducts(productsData)
    //saved button style 
    ui.saveButtonsStyle(cartBtn)
    //check for search
})

//get data from api 
class Products {
    getProducts() {
        return productsData;
    }
}


// ** show data on dom
class Ui {
    showOnDom(products) {
        let resaul = " "
        products.forEach(element => {
            //element is a field of db
            resaul +=
                `
            <div class="DBproduct">
            
                <div class="image-container">
                    <img src="${element.imageUrl} " alt="picture"/>
                </div>

                 <div class="product-des">
                     <p class="p-title"> ${element.title}</p>
                    <p class="p-price">${element.price}</p>
                </div>

                <button type="button" class="btn btn-primary btn-small cart-btn" data-id=${element.id}>اضافه به سبد خرید</button> 
            
            </div>
            `

            singleproduct.innerHTML = resaul

        });
        //when user search or click categories
        const localProducts = JSON.parse(localStorage.getItem("products"))
        
        searchInput.addEventListener("input", (e) => {
            filters.searchItems = e.target.value
            this.renderProducts(localProducts, filters);
           
           
            
            
        })
        catalog.addEventListener("click",(e)=>{
            filters.searchItems=e.target.dataset.filter
             const filterdProducts=localProducts.filter(p=>{
                return p.title.toLowerCase().includes(filters.searchItems.toLowerCase())
           })
            modalbody.innerHTML=""
            filterdProducts.forEach((element,index)=>{
                const productDiv=document.createElement("div")
                productDiv.classList.add("searchProduct")
                productDiv.innerHTML=`

                <div class="DBproduct">

                <div class="image-container">
                    <img src="${element.imageUrl} " alt="picture"/>
                </div>

                 <div class="product-des">
                     <p class="p-title"> ${element.title}</p>
                    <p class="p-price">${element.price}</p>
                </div>

                <button type="button" class="btn btn-primary btn-small cart-btn" data-id=${element.id}>اضافه به سبد خرید</button> 

            </div>
                `
                modalbody.appendChild(productDiv)
                this.saveButtonsStyle(cartBtn)
                this.setCartValue(cart)
            })

        })
    }
    //show searched product in modal on dom when search button clicked
    renderProducts(_localProducts, _filters) {
        const filterdProducts = _localProducts.filter(p => {
            return p.title.toLowerCase().includes(filters.searchItems.toLowerCase())
                                    })
        searchBtn.addEventListener("click", () => {
            modalbody.innerHTML = ""
            filterdProducts.forEach((Sitem, index) => {
                const productDiv = document.createElement("div")
                productDiv.classList.add("searchProduct")
                productDiv.innerHTML = `
                
                <div class="DBproduct">
            
                <div class="image-container">
                    <img src="${Sitem.imageUrl} " alt="picture"/>
                </div>

                 <div class="product-des">
                     <p class="p-title"> ${Sitem.title}</p>
                    <p class="p-price">${Sitem.price}</p>
                </div>

                <button type="button" class="btn btn-primary btn-small cart-btn" data-id=${Sitem.id}>اضافه به سبد خرید</button> 
            
            </div>
                `
                modalbody.appendChild(productDiv)
               this.saveButtonsStyle(cartBtn)
            })

                                     })
    }



    getCartBtn() {
        const cartBtns = document.querySelectorAll(".cart-btn")
        buttons = [...cartBtns]
        console.log("buttons");
        console.log(buttons);
        buttons.forEach(btn => {
            const productId = btn.dataset.id
            //check id in cart 
            const IsInCart = cart.find(p => p.id === productId);

            if (IsInCart) {
                btn.innerText = "موجود در سبد "
                btn.disabled = true
            }

            btn.addEventListener("click", (event) => {
                event.target.innerText = "  موجود در سبد "
                event.target.classList.add("disabled")
                event.target.disabled = true;


                const localProducts = JSON.parse(localStorage.getItem("products"))
                Storage.getProduct(productId);
                Storage.saveCart(cart);
                //   const ui=new Ui();
                this.setCartValue(cart)
                //show product in cart

                const CartElem = cart[cart.length - 1]
                this.addCartitem(CartElem)

            })



        });
        //end of foreach
        //increment ,decrement and delet item in cart 
        showResaultContent.addEventListener("click", (e) => {
            if (e.target.classList.contains("fa-arrow-up")) {
                const addQuantity = e.target

                //find the product in cart
                const addedItem = cart.find((citem) => { return citem.id == addQuantity.dataset.id })
                console.log("addedItem");
                console.log(addedItem);
                addedItem.quntity++
                //update setcartvalu--->total and basketnumber
                this.setCartValue(cart);
                //update innertext in target
                addQuantity.nextElementSibling.innerText = addedItem.quntity
                //save cart in localstorage
                Storage.saveCart(cart)


            }
            else if (e.target.classList.contains("fa-arrow-down")) {
                const decrementQuntity = e.target
                //find the product in cart
                const decrementItem = cart.find((citem) => citem.id == decrementQuntity.dataset.id)
                if (decrementItem.quntity === 1) {
                    cart = cart.filter((citem) => { return citem.id !== parseInt(decrementItem.id) })

                    this.setCartValue(cart)

                    decrementQuntity.parentElement.parentElement.remove()
                    Storage.saveCart(cart);
                    this.EnableButton(decrementQuntity.dataset.id)
                }
                else {
                    decrementItem.quntity--
                    console.log(decrementItem.quntity);

                    //    //update setcartvalu--->total and basketnumber
                    this.setCartValue(cart);
                    //    //update innertext in target

                    decrementQuntity.previousElementSibling.innerText = decrementItem.quntity
                    //    //save cart in localstorage
                    Storage.saveCart(cart)
                }


            }
            else if (e.target.classList.contains("fa-trash-can")) {
                const removeitem = e.target

                // remove from modal 
                removeitem.parentElement.remove()
                //remove from cart array
                cart = cart.filter((r) => { return r.id !== parseInt(e.target.dataset.id) })
                this.setCartValue(cart)
                Storage.saveCart(cart);
                //change buttons style
                this.EnableButton(e.target.dataset.id)




            }

        })

    }//end method
    // set total and numberof basket
    setCartValue(cart) {
        let tempCartItems = 0;
        const Totalprice = cart.reduce((acc, curr) => {
            tempCartItems += curr.quntity;
            return acc + curr.quntity * curr.price
        }, 0)
        number.innerText = tempCartItems;
        cartTotal.innerText = `مجموع قیمت:${Totalprice}`

    }
    //show cart on Dom 
    addCartitem(cartItem) {
        const div = document.createElement("div")
        div.classList.add("cart-item")
        div.innerHTML = `
                       <img  class="cart-item-img" src="${cartItem.imageUrl}" alt="picture"/>
                        <div class="cart-itemDes">
                        <p class="title">${cartItem.title}</p>
                        <p class="price">${cartItem.price}</p>
                        
                        </div>
                        <div class="cart-itemController">
                        <i class="fa-solid fa-arrow-up" data-id=${cartItem.id}></i>
                        <p class="NumberOfProd" data-id=${cartItem.id}>${cartItem.quntity}</p>
                        <i class="fa-solid fa-arrow-down"  data-id=${cartItem.id}></i>
                        </div>
                        <i class="fa-solid fa-trash-can" data-id=${cartItem.id}></i>
        `
        showResaultContent.appendChild(div)
        //listener for Basketbtn
        Basketbtn.addEventListener("click", this.ClearBasket)
        //
        //show modal 
        cartIcon.addEventListener("click", () => {
            showResault.style.display = "block";
            mybackdrop.style.display = "block"
        });
        //close modal and backdrop

        mybackdrop.addEventListener("click", this.closeModal)

    }
    //save cartItems in cart when dom loaded
    setUpApp() {
        cart = Storage.getCart() || [];

        cart.forEach(citem => {
            this.addCartitem(citem);
        })
        this.setCartValue(cart);
    }
    //clear all item from cart 
    ClearBasket() {
        //remove from dom 
        const ContentChild = [...showResaultContent.children]//this is object to array
        ContentChild.forEach(item => {
            item.remove();

        })
        //remove from cart in local storage 

        localStorage.removeItem("cart");
        cart = cart.forEach(i => {
            i.removeItem
        })
        cart = Storage.getCart() || [];

        const u = new Ui()
        u.setUpApp();
        buttons.forEach(btn => {
            btn.classList.remove("disabled")
            btn.disabled = false
            btn.innerText = "اضافه به سبد خرید"
        })


        //   this.closeCart(e);




    }

    //disable buttons  
    saveButtonsStyle(cartBtn) {
        const btnsOnDom = document.querySelectorAll(".cart-btn")
        const buttonsss = [...btnsOnDom]
        buttonsss.forEach(btn => {
            const productId = btn.dataset.id
            //check id in cart 
            const isInCart = cart.find(p => p.id === parseInt(productId));

            if (isInCart) {
                btn.innerText = "موجود در سبد "
                btn.disabled = true;
                btn.classList.add("disabled");
            }
        })
    }
    EnableButton(id) {
        const allBtns = document.querySelectorAll(".cart-btn")
        const allBtnsArry = [...allBtns]
        allBtnsArry.forEach(BT => {
            const btnIDs = BT.dataset.id

            //enable buttons 

            if (id === btnIDs) {
                BT.innerText = "اضافه به سبد خرید"
                BT.classList.remove("disabled")
                BT.disabled = false
            }

        })

    }

    closeModal(e) {

        mybackdrop.style.display = "none"
        showResault.style.display = "none";

    }

}


class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(productId) {
        const localProducts = JSON.parse(localStorage.getItem("products"))
        const found = localProducts.find(p => {
            console.log("p.id");
            console.log(p.id);
            return p.id === parseInt(productId)

        })
        cart = [...cart, { ...found, quntity: 1 }];




    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    static getCart() {
        return JSON.parse(localStorage.getItem("cart"))
    }
}//end of Storage






