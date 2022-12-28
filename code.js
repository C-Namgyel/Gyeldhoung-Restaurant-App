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
function askUsername(msg) {
    let username = prompt(msg)
    if (username == null) {
        askUsername("Enter a username to continue using the app\n*Please enter something")
    } else if ((username).trim() != "") {
        if ((username.length >= 3) && (username.length <= 25)) {
            if (containsLetter(username) == true) {
                readRecords("users", {}, function(records) {
                    if ((findInUsername(records, username)) == -1) {
                        createRecord("users", {username:username, userId: localStorage.userId, createDate: getFullDates()}, function(record) {
                            localStorage.username = username;
                        });
                    } else {
                        askUsername("Enter a username to continue using the app\n*Username already taken")
                    }
                });
            } else {
                askUsername("Enter a username to continue using the app\n*Username must contain atleast one letter")
            }
        } else {
            askUsername("Enter a username to continue using the app\n*Username can only have 3 - 25 characters")
        }
    } else {
        askUsername("Enter a username to continue using the app\n*Please enter something")
    }
}
function getFullDates() {
    return((new Date().getDate()) + ":" + (parseInt(new Date().getMonth()) + 1) + ":" + (new Date().getFullYear()))
}
//Splash
setTimeout(function() {
    document.getElementById("noInternet").hidden = true;
    if (navigator.onLine == true) {
        readRecords("users", {}, function(records) {
            setScreen("homeScrn")
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
        if (("username" in localStorage) != true) {
            askUsername(`Enter a username to continue using the app
*Username can only have 3 - 25 characters
*Username must contain atleast one letter`)
        } else {
            readRecords("users", {}, function(records) {
                if (((findInUsername(records, localStorage.username)) != -1)) {
                    if ((records[findInUsername(records, localStorage.username)].createDate) == getFullDates()) {
                        if (((records[findInUsername(records, localStorage.username)].userId) != getUserId())) {
                            askUsername("Enter a username to continue using the app\n*Seems like your username is taken by someone else today. Please choose a new username or add some number after your username")        
                        }
                    }
                } else {
                    createRecord("users", {username:localStorage.username, userId: localStorage.userId, createDate: getFullDates()}, function(record) {

                    })
                }
            })
        }
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
document.getElementById("order").onclick = function() {
    setScreen("orderScrn")
    document.getElementById("homeBtn").hidden = false;
}
document.getElementById("menu").onclick = function() {
    setScreen("menuScrn")
    document.getElementById("homeBtn").hidden = false;
}
document.getElementById("rate").onclick = function() {
    window.open("https://goo.gl/maps/ZNBzfRhG9QQRSvFKA")
}
document.getElementById("feedback").onclick = function() {
    setScreen("feedbackScrn")
    document.getElementById("homeBtn").hidden = false;
}
document.getElementById("about").onclick = function() {
    setScreen("aboutScrn")
    document.getElementById("homeBtn").hidden = false;
    notify("Currently under Development. Will be available soon...")
}
document.getElementById("preOrder").onclick = function() {
    setScreen("preOrderScrn")
    document.getElementById("homeBtn").hidden = false;
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
var orderNum = 0;
document.getElementById("orderAdd").onclick = function() {
    let orderDiv = document.createElement("div");
    let orderInp = document.createElement("select");
    orderInp.id = "orderInput"+orderNum;
    orderInp.style.width = "70%";
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
    let orderAmount = document.createElement("input");
    orderAmount.id = "orderAmount"+orderNum;
    orderAmount.style.width = "22.5%";
    orderAmount.placeholder = "Amount"
    orderAmount.type = "number"
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
    orderDiv.appendChild(orderInp);
    orderDiv.appendChild(orderAmount);
    orderDiv.appendChild(orderDel);
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
        orderNum -= 1
    }
    orderNum += 1
}
document.getElementById("orderSubmitBtn").onclick = function() {
    let elems = ["orderTableNumber", "orderMembers", "orderRemarks"]
    required = false;
    for (e = 0; e < orderNum; e++) {
        elems.push("orderInput"+e);
        elems.push("orderAmount"+e);
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
                let order = {item: document.getElementById("orderInput"+ol).value, amount: document.getElementById("orderAmount"+ol).value}
                orderList.push(order)
            }
            document.getElementById("orderSubmitBtn").innerHTML = "Submitting"
            document.getElementById("orderSubmitBtn").disabled = true;
            createRecord("orders", {user: localStorage.username, orders: JSON.stringify(orderList), members: document.getElementById("orderMembers").value, tableNumber: document.getElementById("orderTableNumber").value, remarks: document.getElementById("orderRemarks").value, date: getFullDates(), used: false}, function(record) {
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
                function download() {
                    html2canvas(document.getElementById("holder")).then(function(canvas) {
                        const image = canvas.toDataURL("image/png", 1.0);
                        const link = document.createElement("a");
                        link.download = "order"+record.id+".png";
                        link.href = image;
                        link.click();
                    });
                }
                document.getElementById("saveOrderQRBtn").onclick = function() {
                    download()
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
var preOrderNum = 0;
document.getElementById("preOrderAdd").onclick = function() {
    let orderDiv = document.createElement("div");
    let orderInp = document.createElement("select");
    orderInp.id = "preOrderInput"+preOrderNum;
    orderInp.style.width = "70%";
    let orderOptTitle = document.createElement("option");
    orderOptTitle.value = "";
    orderOptTitle.disabled = true;
    orderOptTitle.selected = true;
    orderOptTitle.hidden = true;
    orderOptTitle.innerHTML = "Order "+(preOrderNum+1)
    orderInp.appendChild(orderOptTitle);
    for (o = 0; o < menu.length; o++) {
        let orderOpt = document.createElement("option");
        orderOpt.innerHTML = menu[o].item;
        orderInp.appendChild(orderOpt);
    }
    let orderAmount = document.createElement("input");
    orderAmount.id = "preOrderAmount"+preOrderNum;
    orderAmount.style.width = "22.5%";
    orderAmount.placeholder = "Amount"
    orderAmount.type = "number"
    let orderDel = document.createElement("button")
    orderDel.id = "preOrderDel"+preOrderNum;
    orderDel.style.width = "7.5%";
    orderDel.style.backgroundColor = "red"
    orderDel.style.backgroundImage = "url(assets/delLogo.png)";
    orderDel.style.backgroundSize = "contain";
    orderDel.style.backgroundRepeat = "no-repeat";
    orderDel.style.backgroundPosition = "center";
    orderDel.innerHTML = "&nbsp"
    orderDel.value = preOrderNum;
    orderDiv.appendChild(orderInp);
    orderDiv.appendChild(orderAmount);
    orderDiv.appendChild(orderDel);
    document.getElementById("preOrderListHolder").appendChild(orderDiv);
    orderDel.onclick = function(btn) {
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
        preOrderNum -= 1
    }
    preOrderNum += 1
}
document.getElementById("preOrderSubmitBtn").onclick = function() {
    let elems = ["preOrderStartTime", "preOrderEndTime", "preOrderMembers", "preOrderRemarks"]
    let required = false;
    for (e = 0; e < preOrderNum; e++) {
        elems.push("preOrderInput"+e);
        elems.push("preOrderAmount"+e);
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
                let order = {item: document.getElementById("preOrderInput"+ol).value, amount: document.getElementById("preOrderAmount"+ol).value}
                orderList.push(order)
            }
            document.getElementById("preOrderSubmitBtn").innerHTML = "Submitting"
            document.getElementById("preOrderSubmitBtn").disabled = true;
            createRecord("preOrders", {user: localStorage.username, orders: JSON.stringify(orderList), members: document.getElementById("preOrderMembers").value, remarks: document.getElementById("preOrderRemarks").value, date: getFullDates(), used: false}, function(record) {
                setScreen("orderQRScrn")
                let ordersForQR = {
                    user: localStorage.username,
                    id: record.id,
                    members: document.getElementById("preOrderMembers").value,
                    orders: orderList,
                    remarks: document.getElementById("preOrderRemarks").value
                }
                new QRCode(document.getElementById("qrcode"), JSON.stringify(ordersForQR))
                function download() {
                    html2canvas(document.getElementById("holder")).then(function(canvas) {
                        const image = canvas.toDataURL("image/png", 1.0);
                        const link = document.createElement("a");
                        link.download = "order"+record.id+".png";
                        link.href = image;
                        link.click();
                    });
                }
                document.getElementById("saveOrderQRBtn").onclick = function() {
                    download()
                }
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
        let typePreOrder = []
        for (let yo = 0; yo < records.length; yo++) {
            yourOrders["Pre Order"].push(records[yo]);
        }
    });
    function createViewOrder(data) {
        let viewOrderBtn = document.createElement("button");
        console.log("{\"id\":"+data.id+",\"type\":\""+data.type+"\"}")
        viewOrderBtn.value = "{\"id\":"+data.id+",\"type\":\""+data.type+"\"}";
        viewOrderBtn.innerHTML = data.date + "<label style='float: right'>"+data.type+"</label>";
        viewOrderBtn.style.width = "100%";
        viewOrderBtn.style.fontSize = "15"
        viewOrderBtn.style.fontWeight = "bolder"
        viewOrderBtn.style.textAlign = "left"
        document.getElementById("viewOrderHolder").appendChild(viewOrderBtn)
        viewOrderBtn.onclick = function(btn) {
            console.log(JSON.parse(btn.target.value))
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
        });
    }
}
