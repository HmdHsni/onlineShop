const cartIcon=document.querySelector(".cart-icon")
const modal=document.querySelector(".modal")
const backdrop=document.querySelector(".backdrop");
const number=document.querySelector(".number")
const bought=document.querySelector(".bought")
const modalFooter=document.querySelector(".modalFooter")
//const closebtn=document.querySelector(".closebtn")
const cartTotal=document.querySelector(".totla-price")
const cartbtn=document.querySelector(".cart-btn")
let cart=[];
const singleproduct=document.querySelector(".single-product")
import {productsData} from "./products.js";

document.addEventListener('DOMContentLoaded',(e)=>{
    //create obj from products & get data 
    const products=new Products()
    const productsData=products.getProducts();
    const ui=new Ui();
    ui.showOnDom(productsData);
    ui.getCartBtn();
    //save in local storage
    Storage.saveProducts(productsData)
 
    })
//get data from api 
class Products{
    getProducts(){
        return productsData;
    }
}
//show data on dom
class Ui{
    showOnDom(products){
        let resaul=" "
         products.forEach(element => {
             //element is a field of db
             resaul+=
                       `
            <div class="DBproduct">
            
            <div class="image-container">
            <img src="${element.imageUrl} " alt="picture"/>
        </div>
        <div class="product-des">
            <p class="p-title"> ${element.title}</p>
            <p class="p-price">${element.price}</p>
        </div>
        <button class="cart-btn" data-id=${element.id}>اضافه به سبد خرید</button> 
            
            
            
            
            
            
            
            </div>
            `
            
            singleproduct.innerHTML=resaul
            // singleproduct.classList.add(`pic${element.id}`)
        });
        

    }
    getCartBtn(){
        const cartBtns=document.querySelectorAll(".cart-btn")
        const buttons=[...cartBtns]
        buttons.forEach(btn=>{
                        const productId=btn.dataset.id
                        //check id in cart 
                        const IsInCart=cart.find(p=>p.id===productId);
                        
                                        if(IsInCart) {
                                        btn.innerText="in cart"
                                        btn.disabled=true
                                                            }
                        btn.addEventListener("click",(event)=>{
                            event.target.innerText==" in cart "
                            event.target.classList.add("disabled")
                            event.target.disabled=true;

                           const localProducts=JSON.parse(localStorage.getItem("products"))
                           console.log("local products:");
                            console.log(localProducts);
                         Storage.getProduct(productId);
                          Storage.saveCart(cart);
                        //   const ui=new Ui();
                          this.setCartValue(cart)
                      
                        })
                    
   
    
        }); //end of foreach
        
    }//end method
    setCartValue(cart){
        let tempCartItems=0;
        const Totalprice=cart.reduce((acc,curr)=>{
            tempCartItems+=curr.quntity;
            return acc+curr.quntity*curr.price
        },0)
        number.innerText=tempCartItems;
        cartTotal.innerText=`مجموع قیمت:${Totalprice}`
        console.log("dakhel sabad");
        console.log(tempCartItems);
        console.log("total");
        console.log(Totalprice);
    }
    

}//end class

class Storage{
static saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products))
}
 static getProduct(productId){
     console.log("id in getProduct method:");
     console.log(productId);//id is ok 
    const localProducts=JSON.parse(localStorage.getItem("products"))
    // const selectedID=e.target.dataset.id
    const found= localProducts.find(p=>{
        console.log("p.id");
        console.log(p.id);
         return p.id===parseInt(productId)
                     
                        })
     cart=[...cart,{...found,quntity:1}];
     console.log("cart");
     console.log(cart);
     console.log("found");  
    console.log(found.id);
    
    
}
static saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart))
}
}

//listener for Domloaded






//show modal 
cartIcon.addEventListener("click",()=>{
    
     backdrop.style.display="block"
    modal.style.display="block";
// ShowProducts()
    
});
//close modal and backdrop

backdrop.addEventListener("click",closeCart)
// closebtn.addEventListener("click",closeCart)

//functions
function closeCart(e){

        backdrop.style.display="none"
        modal.style.display="none";
    
}
// function ShowProducts(){
//     // console.log(number.textContent)
//     if(number.textContent==0){
//         const htag=document.createElement("h3")
//         htag.classList.add('newElement')
//         htag.innerHTML="سبد خرید خالی است "
//         modal.appendChild(htag)
//     }
//     else{
//         const divTag=document.createElement("div")
//         divTag.classList.add("divTag")
//         const boughtProduct=`
        
//         <img src="" alt="tasvir"/>


//             <div class="description">
//             <p>نام   </p>
//             <p>قیمت</p>
//             </div>

       

//         <div class="NumberOfProd">
//         <i class="fa-solid fa-arrow-up"></i>
//         <p>عدد</p>
//         <i class="fa-solid fa-arrow-down"></i>
//         </div>

//         <i class="fa-solid fa-trash-can"></i>
        
//         `

//         divTag.innerHTML=boughtProduct
//         bought.appendChild(divTag)

//         //modal footer
//         const divfooter=document.createElement("div")
//         divfooter.classList.add("divFooter")
//         const newdivfooter=`
//                         <p>مجموع قیمت </p>
//                         <button class=" modalbtn closebtn">بستن </button>
//                         <button class=" modalbtn conformbtn">ادامه </button>`
//                         divfooter.innerHTML= newdivfooter
//                         modalFooter.appendChild(divfooter)



//     }
// }
 