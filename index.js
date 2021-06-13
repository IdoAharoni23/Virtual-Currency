$(document).ready(function (){
  // חשוב לי להגיד שאני יודע שהקוד לא הכי מסודר, נקי וברור שיש... העבודה עם ריאקט היית מסובכת כי לא באמת למדנו את הספריה לעומק ופשוט למדתי תוך כדי כתיבת הקוד איך לעבוד עם הספריה... לוקח בחשבון שהקוד נראה לא טוב בכלל ויכולתי לחסוך הרבה שורות אבל אני כבר פוחד לשנות ואז הכל יקרוס לי. 
  // עוד דבר שרק לקראת הסוף קלטתי שטעיתי בו זה שבשורת חיפוש של המטבעות הנבחרים (המסומנים) במקום שיחפשו את הסימון של המטבע עשיתי שיחפשו את השם המלא של המטבע... 
  // שורה תחתונה אני מאמין שהכל עובד כמו שצריך אבל הקוד עצמו נראה רע... 

  localStorage.clear()

// =======גיף טעינה בזמן המתנה לצד שרת
$(document).on({
  ajaxStart: function() {  $("#overlay").css("display", "block");  },
   ajaxStop: function() {   $("#overlay").css("display", "none");}    
});
  

// =====setting the event when click "about"

$(".about-navbar").click(function(){
 $(".coins").hide()
 if ($(".about").length) {
  $(".about").show()
  $(".topic").text("About us...")
  $(".coins").hide()
 }else{
  $(".topic").text("About us...")
  $(".main").append(`<div class="about">
  <h1>We Are WallBryce</h1>
  <div>Our goal is to give you the best service and keep you up to date on the value of virtual currencies</div>
  <div>My name is Ido Aharoni, im live in Israel and I'm 22</div>
  <img src="dog.jpg" alt="">
  <button class="close-about"> Click to close </button>
 </div>`)
 }

// =====setting the event when click "close about"
$(document).on("click", ".close-about", function(){
  $(".about").hide()
  $(".topic").text("Exchange rate of virtual coins")
  $(".coins").show()
})
})

  let arrOfCoins =[]
  let favoriteCoins = []
  let numOfFavorite = 0
  let replaceCoin
  let dataOfInput    
  let trigerDiv
  let count = 0
  let select


// ==== create the div with the virtual coins from the api 
$.get("https://api.coingecko.com/api/v3/coins/list",drawCoins)

//==========callback function from the FIRST api
function drawCoins(data) {
  for (let i = 300; i < 400; i++) {
    $('.coins').append(`
    <div class="virtualCoin col-xxl-2 col-xl-2 col-lg-3 col-md-4 col-sm-4 col-xs-1 " id="${data[i].id}">
            <div class="IdToggle">
                <div class="Id">${data[i].symbol}</div>
                <div class="main-toggle">
                  <div class="toggle-btn">
                    <div class="inner-circle"></div>
                  </div>
                </div>
                  </div>
                  <div class="symbol col-12"> ${data[i].id}</div>
                  <div class="moreInfo">
                  <button class="info">More Info</button>
                  </div>
                  </div>`);
                    
  }
             
// ========== setting the event of "more info"
let trigerOfMoreInfo      

$(document).on("click", ".info", function(){

  trigerOfMoreInfo = this
  let mainDiv = ($(this).parents(".virtualCoin"));
  let removeInfo = mainDiv.find(".moreInfoCoin")
  console.log(removeInfo);
  let mainDivId = $(this).parents(".virtualCoin").attr("id")

 //If the user has already received the information at the last two minutes  
  if (localStorage.getItem(mainDivId)) {
    let dif = JSON.parse(localStorage.getItem(mainDivId))
    $(mainDiv).append(`<div class="moreInfoCoin ${mainDivId}" id="${mainDivId}" >
    <div class="topInfo">
    <div class="name">${dif.id}</div>
    <button class="cls-btn ${mainDivId}">x</button>
  </div>
  <div class="forImg">
    <img src=${dif.img} style="width: 25px; height: 25px; background-repeat: no-repeat; background-size:cover; margin-left: 15px;" alt="">
  </div>
  <div class="rate">
      <span class="use"> USD : ${dif.usd}$</span>
      <span class="euro">EURO: ${dif.eur}€</span>
      <span class="ils">NIS: ${dif.ils}₪</span>
  </div>
  </div>`)
  }
  //If the user click "more info" at the first time or that pass more then two minutes from the last click
  else{
    // second api to get more info about the coin
    $.get(`https://api.coingecko.com/api/v3/coins/${mainDivId}`,function (data) {

    let img = data.image.small
      let eur = data.market_data.market_cap.eur
      let usd = data.market_data.market_cap.usd
      let ils = data.market_data.market_cap.ils
      $(mainDiv).append(`<div class="moreInfoCoin ${mainDivId}" id="infoOf${data.id}" >
                            <div class="topInfo">
                            <div class="name">${data.id}</div>
                            <button class="cls-btn" id="${mainDivId}">x</button>
                          </div>
                          <div class="forImg">
                            <img src=${img} style="width: 25px; height: 25px; background-repeat: no-repeat; background-size:cover; margin-left: 15px;" alt="">
                          </div>
                          <div class="rate">
                              <span class="use"> USD : ${usd}$</span>
                              <span class="euro">EURO: ${eur}€</span>
                              <span class="ils">NIS: ${ils}₪</span>
                          </div>
                          </div>`)
                          let obj = {
                            id: `${data.id}`,
                            img: `${img}`,
                            usd: `${usd}`,
                            eur: `${eur}`,
                            ils: `${ils}`
                          }
// clear the information from the localstorage after two minutes
                          localStorage.setItem(`${data.id}`, JSON.stringify(obj))
                          function clearItem(){
                            setTimeout(() => {
                              localStorage.removeItem(mainDivId);
                            }, 120000);
                          }
                          clearItem()
                        })

                        // when we close the "more information"
      $(document).on("click", ".cls-btn", function(){
        let tar = $(this).attr("id");
        let target = $(document).find($(`.moreInfoCoin.${tar}`));
        target.remove()
      })
  }

//end of event more inforamtion
})


//  click on the toggle button 
$(document).on("click", ".main-toggle", function(){
  if ($(this).find(".toggle-btn").hasClass("active")) {
    $(this).find(".toggle-btn").toggleClass("active")
    numOfFavorite -=1
    let indexOfCoin = $.inArray(`${$(this).parent().parent().attr("id")}`, favoriteCoins )
    favoriteCoins.splice(indexOfCoin, 1)
  } else if ($(this).find(".toggle-btn").hasClass("active") == false && numOfFavorite < 5) {
    $(this).find(".toggle-btn").toggleClass("active")
    favoriteCoins.push(`${$(this).parent().parent().attr("id")}`)
    numOfFavorite +=1
  }    else if ($(this).find(".toggle-btn").hasClass("active") == false && numOfFavorite == 5 ) {
    replaceCoin = $(this).parents(".virtualCoin").attr("id")
          $(".fiveCoinFav").css("display", "block") 
          $(".listOfCoins").empty()
          $(".listOfCoins").append(`
          <div class="favoriteCoin">
          <div class="nameOfFavCoin">name of favorite coin: "${favoriteCoins[0]}"</div>
          <div class="toggle-btn-favorite"  id = "${favoriteCoins[0]}">
              <div class="toggle-btn active">
    <div class="inner-circle"></div>
  </div>
          </div>
        </div>
        <div class="favoriteCoin">
          <div class="nameOfFavCoin">name of favorite coin: "${favoriteCoins[1]}"</div>
          <div class="toggle-btn-favorite" id = "${favoriteCoins[1]}">
              <div class="toggle-btn active">
    <div class="inner-circle"></div>
  </div>
          </div>
        </div>
        <div class="favoriteCoin">
          <div class="nameOfFavCoin">name of favorite coin: "${favoriteCoins[2]}"</div>
          <div class="toggle-btn-favorite" id = "${favoriteCoins[2]}">
              <div class="toggle-btn active">
    <div class="inner-circle"></div>
  </div>
          </div>
        </div>
        <div class="favoriteCoin">
          <div class="nameOfFavCoin">name of favorite coin: "${favoriteCoins[3]}"</div>
          <div class="toggle-btn-favorite" id = "${favoriteCoins[3]}">
              <div class="toggle-btn active">
    <div class="inner-circle"></div>
  </div>
          </div>
        </div>
        <div class="favoriteCoin">
          <div class="nameOfFavCoin">name of favorite coin: "${favoriteCoins[4]}"</div>
          <div class="toggle-btn-favorite" id = "${favoriteCoins[4]}">
              <div class="toggle-btn active">
    <div class="inner-circle"></div>
  </div>
          </div>
         `)
         
         
//when the user chose to replace one of the favorite coin   
         $(document).on("click", ".toggle-btn-favorite", function() {
          select = $(this).attr("id")
          let indexOfCoin = $.inArray(select, favoriteCoins )
          favoriteCoins.splice(indexOfCoin, 1)
           let selectCoin = $(".coins").find(`#${select}`)
           $(selectCoin).find(".toggle-btn").removeClass("active")
           $(".fiveCoinFav").css("display", "none")
           $(`#${replaceCoin}`).find(".toggle-btn").addClass("active")
           favoriteCoins.push(`${replaceCoin}`)     
      })

  }

//  the end of the toggle button events 

})

  
// when the user dont want to replace the sixth choise 
$(document).on("click", ".close-btn", function() {
  $(".fiveCoinFav").css("display", "none")
})

// end of the setting of drawCoins function
}


// search favoraie coin in the navbar input
$(".search-navbar").click(function(){
 let coinSearch = $(".text-navbar").val()



  if(jQuery.inArray(coinSearch, favoriteCoins) != -1) {
    $.get(`https://api.coingecko.com/api/v3/coins/${coinSearch}`,function (data) {
      dataOfInput = data  
      let img = dataOfInput.image.small
      let eur = dataOfInput.market_data.market_cap.eur
      let usd = dataOfInput.market_data.market_cap.usd
      let ils = dataOfInput.market_data.market_cap.ils
    $(".coins").hide()
    $(".inputCoin").css("display", "block")
    $(".inputCoin").html(`<div class="virtualCoinInput" id="${dataOfInput.id}">
    <div class="IdToggle">
        <div class="Id">${dataOfInput.symbol}</div>
        <div class="main-toggle" id="toggleOfFav">
          <div class="toggle-btn active" >
            <div class="inner-circle"></div>
          </div>
        </div>
          </div>
          <div class="symbol"> ${dataOfInput.id}</div>
          <div class="moreInfoInput">
          <button class="infoInput">More Info</button>
          <button class="closeInfoInput">close</button>
          </div>
          </div>`)


          $(document).on("click", ".infoInput", function() {
            $(".virtualCoinInput").empty()
          $(".virtualCoinInput").append(`<div class="moreInfoCoin" id="${dataOfInput.id}" >
                            <div class="topInfo">
                            <div class="name">${dataOfInput.id}</div>
                            <button class="cls-btn id="${dataOfInput.id}">x</button>
                          </div>
                          <div class="forImg">
                            <img src=${img} style="width: 25px; height: 25px; background-repeat: no-repeat; background-size:cover; margin-left: 15px;" alt="">
                          </div>
                          <div class="rate">
                              <span class="use"> USD : ${usd}$</span>
                              <span class="euro">EURO: ${eur}€</span>
                              <span class="ils">NIS: ${ils}₪</span>
                          </div>
                          </div>`)
// ==================
                          $(document).on("click", ".cls-btn", function(){
                            let tar = $(this).attr("id");
                            let target = $(document).find($(`.moreInfoCoin.${tar}`));
                            target.remove()
                            $(".virtualCoinInput").html(` <div class="IdToggle">
                            <div class="Id">${dataOfInput.id}</div>
                            <div class="main-toggle" >
                              <div class="toggle-btn active" id="btn-sync">
                                <div class="inner-circle"></div>
                              </div>
                            </div>
                              </div>
                              <div class="symbol"> ${dataOfInput.symbol}</div>
                              <div class="moreInfoInput">
                              <button class="infoInput">More Info</button>
                              <button class="closeInfoInput">close</button></div>`)
                         
                              $(document).on("click", ".closeInfoInput", function(){
                                $(".inputCoin").hide()
                                $(".coins").show()
                                count = 0
                              })
                            })  
          })
        })
        $(".text-navbar").val("")
          
}else{
alert("your input valueis  don't in your top 5 coins")}
})



$(document).on("click", ".closeInfoInput", function(){
  $(".coins").show()

  let id = $(this).parents(".virtualCoinInput").attr("id");
  if ($.inArray(id,favoriteCoins) == -1) {
    $(".coins").find(`#${id}`).find(".toggle-btn").removeClass("active")
    
  }

  $(".inputCoin").hide()
})


$(document).on("click", ".info", function(){
  let parentOfThis = $(this).parents(".virtualCoin")
  $(parentOfThis).find(".IdToggle").hide()
  $(parentOfThis).find(".symbol").hide()
  $(parentOfThis).find(".moreInfo").hide()

})

$(document).on("click", ".cls-btn", function(){
  let parentOfThis = $(this).parents(".virtualCoin")
  $(parentOfThis).find(".IdToggle").show()
  $(parentOfThis).find(".symbol").show()
  $(parentOfThis).find(".moreInfo").show()

})


$(".hideNav").hide()

$(".navbar-toggler").click(function(){$(".hideNav").slideToggle()})


$(window).resize(function(){if ($(window).width() > 992) {$(".hideNav").hide()}})


$(document).on("click", ".home-navbar", function(){
  $(".about").hide()
  $(".topic").text("Exchange rate of virtual coins")
  $(".coins").show()
})




$(".search-navbar1").click(function(){
  let coinSearch = $(".text-navbar1").val()
  console.log(coinSearch);
 
 
 
   if(jQuery.inArray(coinSearch, favoriteCoins) != -1) {
     $.get(`https://api.coingecko.com/api/v3/coins/${coinSearch}`,function (data) {
       dataOfInput = data  
       let img = dataOfInput.image.small
       let eur = dataOfInput.market_data.market_cap.eur
       let usd = dataOfInput.market_data.market_cap.usd
       let ils = dataOfInput.market_data.market_cap.ils
     $(".coins").hide()
     $(".inputCoin").css("display", "block")
     $(".inputCoin").html(`<div class="virtualCoinInput" id="${dataOfInput.id}">
     <div class="IdToggle">
         <div class="Id">${dataOfInput.symbol}</div>
         <div class="main-toggle" id="toggleOfFav">
           <div class="toggle-btn active" >
             <div class="inner-circle"></div>
           </div>
         </div>
           </div>
           <div class="symbol"> ${dataOfInput.id}</div>
           <div class="moreInfoInput">
           <button class="infoInput">More Info</button>
           <button class="closeInfoInput">close</button>
           </div>
           </div>`)
 
 
           $(document).on("click", ".infoInput", function() {
             $(".virtualCoinInput").empty()
           $(".virtualCoinInput").append(`<div class="moreInfoCoin" id="${dataOfInput.id}" >
                             <div class="topInfo">
                             <div class="name">${dataOfInput.id}</div>
                             <button class="cls-btn id="${dataOfInput.id}">x</button>
                           </div>
                           <div class="forImg">
                             <img src=${img} style="width: 25px; height: 25px; background-repeat: no-repeat; background-size:cover; margin-left: 15px;" alt="">
                           </div>
                           <div class="rate">
                               <span class="use"> USD : ${usd}$</span>
                               <span class="euro">EURO: ${eur}€</span>
                               <span class="ils">NIS: ${ils}₪</span>
                           </div>
                           </div>`)
 // ==================
                           $(document).on("click", ".cls-btn", function(){
                             let tar = $(this).attr("id");
                             let target = $(document).find($(`.moreInfoCoin.${tar}`));
                             target.remove()
                             $(".virtualCoinInput").html(` <div class="IdToggle">
                             <div class="Id">${dataOfInput.id}</div>
                             <div class="main-toggle" >
                               <div class="toggle-btn active" id="btn-sync">
                                 <div class="inner-circle"></div>
                               </div>
                             </div>
                               </div>
                               <div class="symbol"> ${dataOfInput.symbol}</div>
                               <div class="moreInfoInput">
                               <button class="infoInput">More Info</button>
                               <button class="closeInfoInput">close</button></div>`)
                          
                               $(document).on("click", ".closeInfoInput", function(){
                                 $(".inputCoin").hide()
                                 $(".coins").show()
                                 count = 0
                               })
                             })  
           })
         })
         $(".text-navbar1").val("")
           
 }else{
 alert("your input valueis  don't in your top 5 coins")}
 })

 $(document).on("click", ".cls-btn", function(){

    let closeInfo = $(this).parent().parent()
      $(closeInfo).remove()
})

})