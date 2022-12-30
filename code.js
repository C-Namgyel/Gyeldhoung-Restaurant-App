//Font size for all which doesnt have
var elements = document.querySelectorAll( 'body *' );
for (es = 0; es < elements.length; es++) {
    if (elements[es].style.fontSize == "") {
        elements[es].style.fontSize = "14"
    }
}
window.addEventListener('online', function() {
    notify("Internet connection restored")
    document.getElementById("noInternet2").hidden = true;
});
window.addEventListener('offline', function() {
    notify("Internet Connection lost")
    document.getElementById("noInternet2").hidden = false;
});
function recheckInternet() {
    if (navigator.onLine == true) {
        document.getElementById("noInternet").hidden = true;
    } else {
        notify("Check your internet connection and try again")
        document.getElementById("noInternet").hidden = false;
    }
}
//functions
function setScreen(scrnId) {
    for (i = 0; i < document.querySelectorAll(".scrn").length; i++) {
        if(document.getElementsByClassName("scrn")[i].id == scrnId) {
            document.getElementById(document.getElementsByClassName("scrn")[i].id).hidden = false;
        } else {
            document.getElementById(document.getElementsByClassName("scrn")[i].id).hidden = true;
        }
    }
}
function findInUsername(arra, valName) {
    let finder = arra.findIndex(function(element) {
        if (element.username == valName) {
            return true;
        }
        return false;
    });
    return(finder)
}
function findInUserId(arra, valName) {
    let finder = arra.findIndex(function(element) {
        if (element.userId == valName) {
            return true;
        }
        return false;
    });
    return(finder)
}
function findInCreateDate(arra, valName) {
    let finder = arra.findIndex(function(element) {
        if (element.createDate == valName) {
            return true;
        }
        return false;
    });
    return(finder)
}
function findInCreateDate(arra, valName) {
    let finder = arra.findIndex(function(element) {
        if (element.createDate == valName) {
            return true;
        }
        return false;
    });
    return(finder)
}
function findInIds(arra, valName) {
    let finder = arra.findIndex(function(element) {
        if (element.id == valName) {
            return true;
        }
        return false;
    });
    return(finder)
}
function getUserId() {
    if ('userId' in localStorage) {
        return(localStorage.userId)
    } else {
        return("Error!")
    }
}
function containsNumbers(str) {
    return /\d/.test(str);
}
function containsLetter(str) {
    return /[A-Za-z\s]/.test(str);
}
function animation(id, animationName, duration) {
    document.getElementById(id).style.animationName=animationName;
    document.getElementById(id).style.animationDuration=duration
    document.getElementById(id).style.animationFillMode="forwards"
}
var notifyWait;
function notify(msg) {
    clearTimeout(notifyWait)
    document.getElementById("notify").innerHTML = msg;
    animation("notify", "notifyIn", "0.5s")
    notifyWait = setTimeout(function() {
        animation("notify", "notifyOut", "1.5s")
    }, 2000)
}
function download(record) {
    html2canvas(document.getElementById("holder")).then(function(canvas) {
        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.download = "order"+record.id+".png";
        link.href = image;
        link.click();
    });
}
function askUsername(msg, createorupdate) {
    let username = prompt(msg)
    if (username == null) {
        askUsername("Enter a username to continue using the app\n*Please enter something", "Create")
    } else if ((username).trim() != "") {
        if ((username.length >= 3) && (username.length <= 25)) {
            if (containsLetter(username) == true) {
                readRecords("users", {}, function(records) {
                    if (findInUsername(records, username) == -1) {
                        document.getElementById("navUsername").innerHTML = username;
                        if (createorupdate == "Create") {
                            createRecord("users", {username:username, userId: localStorage.userId, createDate: getFullDates()}, function(record) {
                                localStorage.username = username;
                            });
                        } else {
                            updateRecord("users", {id: records[findInUserId(records, getUserId())].id, username:username, userId: localStorage.userId, createDate: getFullDates()}, function(record, success) {
                                if (success == true) {
                                    notify("Successfully changed")
                                    localStorage.username = username;
                                } else {
                                    notify("Falied. Please try again")
                                }
                            });
                        }
                    } else {
                        if (records[findInUsername(records, username)].userId != getUserId()) {
                            askUsername("Enter a username to continue using the app\n*Username already taken", "Create")
                        } else {
                            notify("Cannot change username. New username is same as old one")
                        }
                    }
                });
            } else {
                askUsername("Enter a username to continue using the app\n*Username must contain atleast one letter", "Create")
            }
        } else {
            askUsername("Enter a username to continue using the app\n*Username can only have 3 - 25 characters", "Create")
        }
    } else {
        askUsername("Enter a username to continue using the app\n*Please enter something", "Create")
    }
}
function getFullDates() {
    return((new Date().getDate()) + ":" + (parseInt(new Date().getMonth()) + 1) + ":" + (new Date().getFullYear()))
}
function message(placeHolder, enableSeconds) {
    let div = document.createElement("div")
    div.style.width = "65%"
    div.style.position = "fixed"
    div.style.top = "0%"
    div.style.left = "12.5%"
    div.style.borderStyle = "solid"
    div.style.borderWidth ="1px"
    div.style.borderRadius = "15px"
    div.style.backgroundColor = "white"
    div.style.zIndex = "99999"
    div.style.padding ="5%"
    let label = document.createElement("label")
    label.innerHTML = placeHolder,
    label.style.display = "inline-block"
    label.style.width = "100%";
    let ok = document.createElement("button");
    ok.style.width = "25%"
    ok.innerHTML = "OK (" + enableSeconds + "s)"
    ok.style.float = "right"
    ok.style.borderStyle = "none"
    ok.style.backgroundColor = "white"
    ok.disabled = true;
    div.appendChild(label)
    div.appendChild(document.createElement("br"))
    div.appendChild(document.createElement("br"))
    div.appendChild(ok)
    document.body.appendChild(div)
    div.style.top = (((window.getComputedStyle(document.body).height).slice(0,this.length - 2) / 2) - (div.clientHeight / 2)) + "px"
    let CDNum = enableSeconds;
    let CD = setInterval(function() {
        CDNum -= 1;
        ok.innerHTML = "OK (" + CDNum + "s)"
        if (CDNum <= 0) {
            ok.disabled = false;
            ok.innerHTML = "OK";
            ok.onclick = function() {
                div.remove()
            }
            clearInterval(CD);
        }
    }, 1000)
    
}
//Splash
setTimeout(function() {
    document.getElementById("noInternet").hidden = true;
    if (navigator.onLine == true) {
        readRecords("users", {}, function(records) {
            setScreen("homeScrn")
            if (("username" in localStorage) != true) {
                askUsername(`Enter a username to continue using the app
*Username can only have 3 - 25 characters
*Username must contain atleast one letter`, "Create")
            } else {
                readRecords("users", {}, function(records) {
                    if (((findInUsername(records, localStorage.username)) != -1)) {
                        if ((records[findInUsername(records, localStorage.username)].createDate) == getFullDates()) {
                            if (((records[findInUsername(records, localStorage.username)].userId) != getUserId())) {
                                askUsername("Enter a username to continue using the app\n*Seems like your username is taken by someone else today. Please choose a new username or add some number after your username", "Create")        
                            }
                        }
                    } else {
                        createRecord("users", {username:localStorage.username, userId: localStorage.userId, createDate: getFullDates()}, function(record) {
                            document.getElementById("navUsername").innerHTML = localStorage.username;
                        })
                    }
                })
            }
            document.getElementById("homeMenuBtn").hidden = false;
            var allCreateDates = [];
            for (let i = 0; i < records.length; i++) {
                allCreateDates.push(records[i].createDate);
            }
            function findOdds(arr, val) {
                let odds = []
                for (let o = 0; o < arr.length; o++) {
                    if (arr[o] != val) {
                        odds.push(arr[o])
                    }
                }
                let filteredOdds = []
                for (let fo = 0; fo < odds.length; fo++) {
                    if (filteredOdds.indexOf(odds[fo]) == -1) {
                        filteredOdds.push(odds[fo])
                    }
                }
                return(filteredOdds)
            }
            let toDelDates = findOdds(allCreateDates, getFullDates())
            let indexes = []
            for (let d = 0; d < toDelDates.length; d++) {
                for (i = 0; i < records.length; i++) {
                    if (records[i].createDate == toDelDates[d]) {
                        indexes.push(i);
                    }
                }
            }
            for (let di = 0; di < indexes.length; di++) {
                deleteRecord("users", {id: records[indexes[di]].id}, function(success) {
                });
            }
        }) 
    } else {
        document.getElementById("noInternet").hidden = false;
    }
}, 1500)
//Setup
function setCenter() {
    let pxVal = ((parseInt(document.body.clientWidth) / 2) - (320 / 2))
    document.getElementById("screens").style.left = ((100 * pxVal) / document.body.offsetWidth) + "%";
}
setCenter();
document.body.onresize = function() { 
    setCenter();
}
//Notifier Control
document.getElementById("notify").onclick = function() {
    animation("notify", "notifyOut", "0.5s");
    clearTimeout(notifyWait)
}
//If not proceeded
setTimeout(function() {
    if (document.getElementById("splashScrn").hidden == false) {
        document.getElementById("noInternet").hidden = false;
        notify("Please check your internet connection and try again")
    }
}, 5000)
//Create userId if doesnt exist
readRecords("users", {}, function(records) {
    if (('userId' in localStorage) == false) {
        function createId() {
            let tempUserId = "";
            for (t = 0; t < 6; t++) {
                let rand = ("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")[Math.floor(Math.random()*((("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ").length - 1) - 0 + 1) + 0)]
                tempUserId += rand;
            }
            if (findInUserId(records, tempUserId) == -1) {
                localStorage.userId = tempUserId;
            } else {
                createId();
            }
        }
        createId();
    }
});
//Home Screen
document.getElementById("homeBtn").onclick = function() {
    setScreen("homeScrn")
    this.hidden = true;
    document.getElementById("homeMenuBtn").hidden = false;
}
document.getElementById("homeMenuBtn").onclick = function() {
    animation("navDiv", "navOpen", "0.5s")
    document.getElementById("barrier").hidden = false;
}
document.getElementById("barrier").onclick = function() {
    animation("navDiv", "navClose", "0.5s")
    document.getElementById("barrier").hidden = true;
}
document.getElementById("order").onclick = function() {
    setScreen("orderScrn")
    document.getElementById("homeBtn").hidden = false;
    document.getElementById("homeMenuBtn").hidden = true;
    menuCloseOn = false;
}
document.getElementById("menu").onclick = function() {
    setScreen("menuScrn")
    document.getElementById("homeBtn").hidden = false;
    document.getElementById("homeMenuBtn").hidden = true;
    menuCloseOn = false;
}
document.getElementById("rate").onclick = function() {
    window.open("https://goo.gl/maps/ZNBzfRhG9QQRSvFKA")
}
document.getElementById("feedback").onclick = function() {
    setScreen("feedbackScrn")
    document.getElementById("homeBtn").hidden = false;
    document.getElementById("homeMenuBtn").hidden = true;
    menuCloseOn = false;
}
document.getElementById("about").onclick = function() {
    setScreen("aboutScrn")
    document.getElementById("homeBtn").hidden = false;
    notify("Currently under Development. Will be available soon...")
    document.getElementById("homeMenuBtn").hidden = true;
    menuCloseOn = false;
}
document.getElementById("preOrder").onclick = function() {
    setScreen("preOrderScrn")
    document.getElementById("homeBtn").hidden = false;
    document.getElementById("homeMenuBtn").hidden = true;
    menuCloseOn = false;
}
//Nav
document.getElementById("navUsername").innerHTML = localStorage.username;
document.getElementById("navChangeUsername").onclick = function() {
    askUsername(`Enter the new username.
*Username can only have 3 - 25 characters
*Username must contain atleast one letter`, "Update")
}
//Menu
var menu;
readRecords("menu", {}, function(records) {
    menu = records;
    var menuTypes = []
    for (mt = 0; mt < menu.length; mt++) {
        if (menuTypes.indexOf(menu[mt].type) == -1) {
            menuTypes.push(menu[mt].type);
        }
    }
    for (t = 0; t < menuTypes.length; t++) {
        let title = document.createElement("div");
        title.innerHTML = menuTypes[t]
        title.style.fontSize = "20";
        title.style.fontWeight = "bolder"
        title.style.width = "100%";
        document.getElementById("menuHolder").appendChild(title);
        let table = document.createElement("table");
        table.style.borderCollapse = "collapse";
        table.style.width = "100%";
        table.style.borderStyle = "solid";
        table.style.borderColor = "black"
        table.style.borderWidth = "2px"
        let headerTr = document.createElement("tr")
        headerTr.style.borderStyle = "solid";
        headerTr.style.borderColor = "black"
        headerTr.style.borderWidth = "2px"
        let headerTh0 = document.createElement("th");
        headerTh0.style.borderStyle = "solid";
        headerTh0.style.borderColor = "black"
        headerTh0.style.borderWidth = "1px 2px 1px 1px"
        headerTh0.style.width = "10%"
        headerTh0.innerHTML = "Sl. No"
        headerTr.appendChild(headerTh0);
        let headerTh1 = document.createElement("th");
        headerTh1.style.borderStyle = "solid";
        headerTh1.style.borderColor = "black"
        headerTh1.style.borderWidth = "1px 2px 1px 1px"
        headerTh1.innerHTML = "Item"
        headerTr.appendChild(headerTh1);
        let headerTh2 = document.createElement("th");
        headerTh2.style.borderStyle = "solid";
        headerTh2.style.borderColor = "black";
        headerTh2.style.borderWidth = "1px";
        headerTh2.style.width = "15%";
        headerTh2.innerHTML = "Price"
        headerTr.appendChild(headerTh2);
        table.appendChild(headerTr);
        let menuWithType = [];
        for (mwt = 0; mwt < menu.length; mwt++) {
            if (menu[mwt].type == menuTypes[t]) {
                menuWithType.push(menu[mwt]);
            }
        }
        for (g = 0; g < menuWithType.length; g++) {
            let dishRow = document.createElement("tr")
            let slCell = document.createElement("td");
            slCell.style.borderStyle = "solid";
            slCell.style.borderColor = "black"
            slCell.style.borderWidth = "1px 2px 1px 1px"
            slCell.style.width = "10%";
            slCell.innerHTML = parseInt(g) + 1;
            dishRow.appendChild(slCell);
            let itemCell = document.createElement("td");
            itemCell.style.borderStyle = "solid";
            itemCell.style.borderColor = "black"
            itemCell.style.borderWidth = "1px 2px 1px 1px"
            itemCell.innerHTML = menuWithType[g].item;
            dishRow.appendChild(itemCell);
            let priceCell = document.createElement("td");
            priceCell.style.borderStyle = "solid";
            priceCell.style.borderColor = "black"
            priceCell.style.borderWidth = "1px"
            priceCell.style.width = "15%";
            priceCell.innerHTML = menuWithType[g].price;
            dishRow.appendChild(priceCell);
            table.appendChild(dishRow);
        }
        document.getElementById("menuHolder").appendChild(table)
        document.getElementById("menuHolder").appendChild(document.createElement("br"));
    }
});
//Order Screen
function findInItem(arra, valName) {
    let finder = arra.findIndex(function(element) {

        if (element.item == valName) {
            return true;
        }
        return false;
    });
    return(finder)
}
function orderGetTotal() {
    let total = 0;
    for (t = 0; t < orderNum; t++) {
        total += parseInt(document.getElementById("orderAmount"+t).value)
    }
    if (isNaN(total) == false) {
        document.getElementById("orderTotal").innerHTML = "Nu. "+total;
    }
}
function orderSetAmount(inp) {
    let val = inp.target.name;
    if (isNaN((menu[findInItem(menu, document.getElementById("orderInput" + val).value)].price) * parseInt(document.getElementById("orderQuantity"+val).value)) == false) {
        document.getElementById("orderAmount"+val).innerHTML = "Nu. "+((menu[findInItem(menu, document.getElementById("orderInput" + val).value)].price) * parseInt(document.getElementById("orderQuantity"+val).value))
        document.getElementById("orderAmount"+val).value = ((menu[findInItem(menu, document.getElementById("orderInput" + val).value)].price) * parseInt(document.getElementById("orderQuantity"+val).value))
        orderGetTotal()
    }
}
var orderNum = 0;
document.getElementById("orderAdd").onclick = function() {
    let orderDiv = document.createElement("div");
    orderDiv.style.width = "100%"
    let orderInp = document.createElement("select");
    orderInp.id = "orderInput"+orderNum;
    orderInp.style.width = "50%";
    orderInp.name = orderNum
    let orderOptTitle = document.createElement("option");
    orderOptTitle.value = "";
    orderOptTitle.disabled = true;
    orderOptTitle.selected = true;
    orderOptTitle.hidden = true;
    orderOptTitle.innerHTML = "Order "+(orderNum+1)
    orderInp.appendChild(orderOptTitle);
    for (o = 0; o < menu.length; o++) {
        let orderOpt = document.createElement("option");
        orderOpt.innerHTML = menu[o].item;
        orderInp.appendChild(orderOpt);
    }
    let orderQuantity = document.createElement("input");
    orderQuantity.id = "orderQuantity"+orderNum;
    orderQuantity.style.width = "22.5%";
    orderQuantity.placeholder = "Quantity"
    orderQuantity.type = "number"
    orderQuantity.name = orderNum
    let orderDel = document.createElement("button")
    orderDel.id = "orderDel"+orderNum;
    orderDel.style.width = "7.5%";
    orderDel.style.backgroundColor = "red"
    orderDel.style.backgroundImage = "url(assets/delLogo.png)";
    orderDel.style.backgroundSize = "contain";
    orderDel.style.backgroundRepeat = "no-repeat";
    orderDel.style.backgroundPosition = "center";
    orderDel.innerHTML = "&nbsp"
    orderDel.value = orderNum;
    let orderAmount = document.createElement("label");
    orderAmount.id = "orderAmount"+orderNum;
    orderAmount.style.width = "20%"
    orderAmount.style.textAlign = "center"
    orderAmount.innerHTML = "Amount"
    orderAmount.style.display = "inline-block"
    orderDiv.appendChild(orderInp);
    orderDiv.appendChild(orderQuantity);
    orderDiv.appendChild(orderDel);
    orderDiv.appendChild(orderAmount)
    document.getElementById("orderListHolder").appendChild(orderDiv);
    orderDel.onclick = function(btn) {
        let val = (btn.target.value)
        for (d = val; d < orderNum; d++) {
            if (d != (orderNum - 1)) {
                document.getElementById("orderInput"+d).value = document.getElementById("orderInput"+(parseInt(d)+1)).value;
                document.getElementById("orderAmount"+d).value = document.getElementById("orderAmount"+(parseInt(d)+1)).value
            }
        }
        document.getElementById("orderInput"+(orderNum - 1)).remove()
        document.getElementById("orderAmount"+(orderNum - 1)).remove()
        document.getElementById("orderDel"+(orderNum - 1)).remove()
        document.getElementById("orderQuantity"+(orderNum - 1)).remove()
        orderNum -= 1
        orderGetTotal()
    }
    orderQuantity.onchange = function(inp) {
        orderSetAmount(inp)
    }
    orderInp.onchange = function(inp) {
        orderSetAmount(inp)
    }
    orderNum += 1
}
document.getElementById("orderSubmitBtn").onclick = function() {
    let elems = ["orderTableNumber", "orderMembers"]
    required = false;
    for (e = 0; e < orderNum; e++) {
        elems.push("orderInput"+e);
        elems.push("orderQuantity"+e);
    }
    for (c = 0; c < elems.length; c++) {
        if ((document.getElementById(elems[c]).value).trim() != "") {
            required = false;
        } else {
            required = true;
            c = elems.length;
        }
    }
    if (required  == false) {
        if (orderNum > 0) {
            let orderList = [];
            for (ol = 0; ol < orderNum; ol++) {
                let order = {item: document.getElementById("orderInput"+ol).value, quantity: document.getElementById("orderQuantity"+ol).value}
                orderList.push(order)
            }
            document.getElementById("orderSubmitBtn").innerHTML = "Submitting"
            document.getElementById("orderSubmitBtn").disabled = true;
            document.getElementById("qrcode").innerHTML = ""
            createRecord("orders", {user: localStorage.username, orders: JSON.stringify(orderList), members: document.getElementById("orderMembers").value, tableNumber: document.getElementById("orderTableNumber").value, remarks: document.getElementById("orderRemarks").value, date: getFullDates(), used: false, type: "Order"}, function(record) {
                setScreen("orderQRScrn")
                let ordersForQR = {
                    user: localStorage.username,
                    id: record.id,
                    tableNumber: document.getElementById("orderTableNumber").value,
                    members: document.getElementById("orderMembers").value,
                    orders: orderList,
                    remarks: document.getElementById("orderRemarks").value
                }
                new QRCode(document.getElementById("qrcode"), JSON.stringify(ordersForQR))
                document.getElementById("saveOrderQRBtn").onclick = function() {
                    download(record)
                }
                notify("Order successfullt submitted")
                document.getElementById("orderSubmitBtn").innerHTML = "Submit"
                document.getElementById("orderSubmitBtn").disabled = false;
            });
        } else {
            notify("Please add atleast one order");
        }
    } else {
        notify("Please fill up all the spaces")
    }
}
//PreOrder Screen
function preOrderGetTotal() {
    let total = 0;
    for (t = 0; t < preOrderNum; t++) {
        total += parseInt(document.getElementById("preOrderAmount"+t).value)
    }
    if (isNaN(total) == false) {
        document.getElementById("preOrderTotal").innerHTML = "Nu. "+total;
    }
}
function preOrderSetAmount(inp) {
    let val = inp.target.name;
    if (isNaN((menu[findInItem(menu, document.getElementById("preOrderInput" + val).value)].price) * parseInt(document.getElementById("preOrderQuantity"+val).value)) == false) {
        document.getElementById("preOrderAmount"+val).innerHTML = "Nu. "+((menu[findInItem(menu, document.getElementById("preOrderInput" + val).value)].price) * parseInt(document.getElementById("preOrderQuantity"+val).value))
        document.getElementById("preOrderAmount"+val).value = ((menu[findInItem(menu, document.getElementById("preOrderInput" + val).value)].price) * parseInt(document.getElementById("preOrderQuantity"+val).value))
        preOrderGetTotal()
    }
}
var preOrderNum = 0;
document.getElementById("preOrderAdd").onclick = function() {
    let preOrderDiv = document.createElement("div");
    preOrderDiv.style.width = "100%"
    let preOrderInp = document.createElement("select");
    preOrderInp.id = "preOrderInput"+preOrderNum;
    preOrderInp.style.width = "50%";
    preOrderInp.name = preOrderNum
    let preOrderOptTitle = document.createElement("option");
    preOrderOptTitle.value = "";
    preOrderOptTitle.disabled = true;
    preOrderOptTitle.selected = true;
    preOrderOptTitle.hidden = true;
    preOrderOptTitle.innerHTML = "Order "+(preOrderNum+1)
    preOrderInp.appendChild(preOrderOptTitle);
    for (o = 0; o < menu.length; o++) {
        let preOrderOpt = document.createElement("option");
        preOrderOpt.innerHTML = menu[o].item;
        preOrderInp.appendChild(preOrderOpt);
    }
    let preOrderQuantity = document.createElement("input");
    preOrderQuantity.id = "preOrderQuantity"+preOrderNum;
    preOrderQuantity.style.width = "22.5%";
    preOrderQuantity.placeholder = "Quantity"
    preOrderQuantity.type = "number"
    preOrderQuantity.name = preOrderNum
    let preOrderDel = document.createElement("button")
    preOrderDel.id = "preOrderDel"+preOrderNum;
    preOrderDel.style.width = "7.5%";
    preOrderDel.style.backgroundColor = "red"
    preOrderDel.style.backgroundImage = "url(assets/delLogo.png)";
    preOrderDel.style.backgroundSize = "contain";
    preOrderDel.style.backgroundRepeat = "no-repeat";
    preOrderDel.style.backgroundPosition = "center";
    preOrderDel.innerHTML = "&nbsp"
    preOrderDel.value = preOrderNum;
    let preOrderAmount = document.createElement("label");
    preOrderAmount.id = "preOrderAmount"+preOrderNum;
    preOrderAmount.style.width = "20%"
    preOrderAmount.style.textAlign = "center"
    preOrderAmount.innerHTML = "Amount"
    preOrderAmount.style.display = "inline-block"
    preOrderDiv.appendChild(preOrderInp);
    preOrderDiv.appendChild(preOrderQuantity);
    preOrderDiv.appendChild(preOrderDel);
    preOrderDiv.appendChild(preOrderAmount)
    document.getElementById("preOrderListHolder").appendChild(preOrderDiv);
    preOrderDel.onclick = function(btn) {
        let val = (btn.target.value)
        for (d = val; d < preOrderNum; d++) {
            if (d != (preOrderNum - 1)) {
                document.getElementById("preOrderInput"+d).value = document.getElementById("preOrderInput"+(parseInt(d)+1)).value;
                document.getElementById("preOrderAmount"+d).value = document.getElementById("preOrderAmount"+(parseInt(d)+1)).value
            }
        }
        document.getElementById("preOrderInput"+(preOrderNum - 1)).remove()
        document.getElementById("preOrderAmount"+(preOrderNum - 1)).remove()
        document.getElementById("preOrderDel"+(preOrderNum - 1)).remove()
        document.getElementById("preOrderQuantity"+(preOrderNum - 1)).remove()
        preOrderNum -= 1
        preOrderGetTotal()
    }
    preOrderQuantity.onchange = function(inp) {
        preOrderSetAmount(inp)
    }
    preOrderInp.onchange = function(inp) {
        preOrderSetAmount(inp)
    }
    preOrderNum += 1
}
document.getElementById("preOrderSubmitBtn").onclick = function() {
    let elems = ["preOrderTime", "preOrderMembers"]
    let required = false;
    for (e = 0; e < preOrderNum; e++) {
        elems.push("preOrderInput"+e);
        elems.push("preOrderQuantity"+e);
    }
    for (c = 0; c < elems.length; c++) {
        if ((document.getElementById(elems[c]).value).trim() != "") {
            required = false;
        } else {
            required = true;
            c = elems.length;
        }
    }
    if (required  == false) {
        if (preOrderNum > 0) {
            let orderList = [];
            for (ol = 0; ol < preOrderNum; ol++) {
                let order = {item: document.getElementById("preOrderInput"+ol).value, quantity: document.getElementById("preOrderQuantity"+ol).value}
                orderList.push(order)
            }
            document.getElementById("preOrderSubmitBtn").innerHTML = "Submitting"
            document.getElementById("preOrderSubmitBtn").disabled = true;
            document.getElementById("qrcode").innerHTML = ""
            createRecord("preOrders", {user: localStorage.username, orders: JSON.stringify(orderList), members: document.getElementById("preOrderMembers").value, remarks: document.getElementById("preOrderRemarks").value, date: getFullDates(), used: false, type: "Pre Order", time: document.getElementById("preOrderTime").value, tableNumber: "", arrived: false}, function(record) {
                message("Your order is successfully submitted. But you must notify the workers that you have arrived. You can do that later after you have arrived at the restaurant.<br>After arriving the restaurant,<br>1. open the app<br>2. Click 'View your orders'<br>3. Click on the order which has the label 'Pre Order' at the right of the button<br>4. Enter your table number and then click 'Arrived'", 10)
                setScreen("homeScrn")
                notify("Order successfullt submitted")
                document.getElementById("preOrderSubmitBtn").innerHTML = "Submit"
                document.getElementById("preOrderSubmitBtn").disabled = false;
            });
        } else {
            notify("Please add atleast one order");
        }
    } else {
        notify("Please fill up all the spaces")
    }
}
//View order scrn
document.getElementById("viewOrders").onclick = function() {
    setScreen("viewOrderScrn");
    document.getElementById("homeMenuBtn").hidden = true;
    menuCloseOn = false;
    document.getElementById("homeBtn").hidden = false;
    document.getElementById("viewOrderHolder").innerHTML = "Loading... Please wait..."
    let loading = 0;
    var yourOrders = {
        "Order": [],
        "Pre Order": []
    }
    readRecords("orders", {user: localStorage.username, date: getFullDates()}, function(records) {
        loading  = parseInt(loading) + 1;
        for (let yo = 0; yo < records.length; yo++) {
            yourOrders["Order"].push(records[yo]);
        }
    });
    readRecords("preOrders", {user: localStorage.username, date: getFullDates()}, function(records) {
        loading = parseInt(loading) + 1;
        for (let yo = 0; yo < records.length; yo++) {
            yourOrders["Pre Order"].push(records[yo]);
        }
    });
    function createViewOrder(data) {
        let viewOrderBtn = document.createElement("button");
        viewOrderBtn.value = "{\"id\":"+data.id+",\"type\":\""+data.type+"\"}";
        viewOrderBtn.innerHTML = data.date + "<label style='float: right'>"+data.type+"</label>";
        viewOrderBtn.style.width = "100%";
        viewOrderBtn.style.fontSize = "15"
        viewOrderBtn.style.fontWeight = "bolder"
        viewOrderBtn.style.textAlign = "left"
        document.getElementById("viewOrderHolder").appendChild(viewOrderBtn)
        viewOrderBtn.onclick = function(btn) {
            let index = findInIds(yourOrders[JSON.parse(btn.target.value).type], JSON.parse(btn.target.value).id)
            document.getElementById("viewOrderInfoMembers").value = yourOrders[JSON.parse(btn.target.value).type][index].members;
            document.getElementById("viewOrderInfoRemarks").value = yourOrders[JSON.parse(btn.target.value).type][index].remarks;
            document.getElementById("viewOrderInfoOrders").innerHTML = ""
            for (let voio = 0; voio < JSON.parse(yourOrders[JSON.parse(btn.target.value).type][index].orders).length; voio++) {
                document.getElementById("viewOrderInfoOrders").innerHTML = document.getElementById("viewOrderInfoOrders").innerHTML + JSON.parse(yourOrders[JSON.parse(btn.target.value).type][index].orders)[voio].item + " - " + JSON.parse(yourOrders[JSON.parse(btn.target.value).type][index].orders)[voio].quantity;
                document.getElementById("viewOrderInfoOrders").appendChild(document.createElement("br"))
            }
            if (yourOrders[JSON.parse(btn.target.value).type][index].type == "Order") {
                document.getElementById("viewOrderInfoTableNumber").value = yourOrders[JSON.parse(btn.target.value).type][index].tableNumber;
                document.getElementById("viewOrderInfoTableNumber").disabled = true;
                document.getElementById("viewOrderInfoTimeHolder").hidden = true;
            } else {
                document.getElementById("viewOrderInfoTimeHolder").hidden = false;
                document.getElementById("viewOrderInfoTime").value = yourOrders[JSON.parse(btn.target.value).type][index].time;
                if (yourOrders[JSON.parse(btn.target.value).type][index].tableNumber != "") {
                    document.getElementById("viewOrderInfoTableNumber").value = yourOrders[JSON.parse(btn.target.value).type][index].tableNumber;
                    document.getElementById("viewOrderInfoTableNumber").disabled = true;
                    document.getElementById("viewOrderInfoArrived").hidden = true;
                } else {
                    document.getElementById("viewOrderInfoTableNumber").value = ""
                    document.getElementById("viewOrderInfoTableNumber").disabled = false;
                    document.getElementById("viewOrderInfoArrived").hidden = false;
                    document.getElementById("viewOrderInfoArrived").onclick = function() {
                        let conf = confirm("The workers will be notified that you have arrived and will be prepared to bring your order in the specified table. Click 'Ok' to continue.")
                        if (conf == true) {
                            if (document.getElementById("viewOrderInfoTableNumber").value != "") {
                                document.getElementById("viewOrderInfoArrived").innerHTML = "Wait...";
                                document.getElementById("viewOrderInfoArrived").disabled = true;
                                updateRecord("preOrders", {id:JSON.parse(btn.target.value).id, user: localStorage.username, orders: yourOrders[JSON.parse(btn.target.value).type][index].orders, members: yourOrders[JSON.parse(btn.target.value).type][index].members, remarks: yourOrders[JSON.parse(btn.target.value).type][index].remarks, date: getFullDates(), used: yourOrders[JSON.parse(btn.target.value).type][index].used, type: yourOrders[JSON.parse(btn.target.value).type][index].type, time: yourOrders[JSON.parse(btn.target.value).type][index].time, tableNumber: document.getElementById("viewOrderInfoTableNumber").value, arrived: true}, function(record, success) {
                                    if (success == true) {
                                        setScreen("orderQRScrn");
                                        document.getElementById("viewOrderInfoArrived").hidden = true;
                                        let ordersForQR = {
                                            user: localStorage.username,
                                            id: record.id,
                                            members: record.members,
                                            orders: record.orders,
                                            remarks: record.remarks
                                        }
                                        new QRCode(document.getElementById("qrcode"), JSON.stringify(ordersForQR))
                                        document.getElementById("saveOrderQRBtn").onclick = function() {
                                            download(record)
                                        }
                                        notify("Workers have been notified")
                                    } else {
                                        notify("Failed. Please try again")
                                    }
                                });
                            } else {
                                notify("Please enter your table number")
                            }
                        }
                    }
                }
            }
            document.getElementById("viewOrderInfoQR").onclick = function() {
                setScreen("orderQRScrn")
                let ordersForQR = {
                    user: localStorage.username,
                    id: yourOrders[JSON.parse(btn.target.value).type][index].id,
                    tableNumber: yourOrders[JSON.parse(btn.target.value).type][index].tableNumber,
                    members: yourOrders[JSON.parse(btn.target.value).type][index].members,
                    orders: yourOrders[JSON.parse(btn.target.value).type][index].orders,
                    remarks: yourOrders[JSON.parse(btn.target.value).type][index].remarks
                }
                new QRCode(document.getElementById("qrcode"), JSON.stringify(ordersForQR))
                document.getElementById("saveOrderQRBtn").onclick = function() {
                    download(yourOrders[JSON.parse(btn.target.value).type][index])
                }
            }
            setScreen("viewOrderInfoScrn")
        }
    }
    let viewOrderLoadWait = setInterval(function() {
        if (loading == 2) {
            document.getElementById("viewOrderHolder").innerHTML = ""
            clearInterval(viewOrderLoadWait);
            for (let cv = 0; cv < Object.keys(yourOrders).length; cv++) {
                for (let o = 0; o < yourOrders[Object.keys(yourOrders)[cv]].length; o++) {
                    createViewOrder(yourOrders[Object.keys(yourOrders)[cv]][o]);
                }
            }
            
        }
    }, 100)
}
//Feedbacks
document.getElementById("feedbackSubmit").onclick = function() {
    if ((document.getElementById("feedbackInput").value).trim() != "") {
        document.getElementById("feedbackSubmit").innerHTML = "Submitting"
        document.getElementById("feedbackSubmit").disabled = true;
        createRecord("feedbacks", {user: localStorage.username, message: document.getElementById("feedbackInput").value}, function(record) {
            document.getElementById("feedbackSubmit").innerHTML = "Submit"
            document.getElementById("feedbackSubmit").disabled = false;
            notify("Feedback/Complaint successfully submitted")
            document.getElementById("feedbackInput").value = "";
        });
    }
}
