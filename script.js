var design = [
    {
        active: false,
        stage: 0,
        navStep: 0,
        visibleState: 'block',
        buttons: ["next"],
    },
    {
        active: false,
        stage: 1,
        navStep: 1,
        visibleState: 'block',
        buttons: ["go-back", "next"],
    },
    {
        active: false,
        stage: 2,
        navStep: 2,
        visibleState: 'block',
        buttons: ["go-back", "next"],
    },
    {
        active: false,
        stage: 3,
        navStep: 3,
        visibleState: 'block',
        buttons: ["go-back", "confirm"],
    },
    {
        active: false,
        stage: 4,
        navStep: 3,
        visibleState: 'flex',
        buttons: [],
    },
],
    user = {
        fullName: "",
        mail: "",
        telNumber: "",
        plan: "",
        period: "",
        addOns: [],
        totalPrice: 0
    },
    stock = {
        yearlyAttr: "yr",
        monthlyAttr: "mo",
        plans: [
            {
                name: "Arcade",
                yearlyPrice: 90,
                monthlyPrice: 9,
            },
            {
                name: "Advanced",
                yearlyPrice: 120,
                monthlyPrice: 12,
            },
            {
                name: "Pro",
                yearlyPrice: 150,
                monthlyPrice: 15,
            }
        ],
        addOns: [
            {
                name: "Online service",
                description: "Access to multiplayer games",
                yearlyPrice: 10,
                monthlyPrice: 1,
            },
            {
                name: "Larger storage",
                description: "Extra 1TB of cloud save",
                yearlyPrice: 20,
                monthlyPrice: 2,
            },
            {
                name: "Customizable Profile",
                description: "Custom theme on your profile",
                yearlyPrice: 20,
                monthlyPrice: 2,
            },
        ]
    }

var btnShowing = document.querySelectorAll("ul.buttons button"),
    plans = document.querySelectorAll(".plan"),
    planPeriod = document.querySelector("#period");


function changePrice(period) {
    document.querySelectorAll(".price[data-category]").forEach(price => {
        let category = price.dataset.category,
            sequence = price.dataset.sequence;
        if (period) {
            var pr = "yr";
            var newAmount = stock[category][sequence].yearlyPrice;
        }
        else {
            var pr = "mo";
            var newAmount = stock[category][sequence].monthlyPrice;
        }
        var plus = ""
        if (price.classList.contains("plus")) {
            plus = "+"
        }
        price.innerHTML = `${plus}$${newAmount}/${pr}`
    })

}


planPeriod.onclick = e => {
    changePrice(e.target.checked)
}

plans.forEach(plan => {
    plan.onclick = e => {
        document.querySelector(".plan.active").classList.remove("active");
        plan.classList.add("active");
    }
})


function mainStep(stage = 0) {
    let contents = document.querySelectorAll("content")
    contents.forEach(content => {
        content.style.display = "none";
    })
    let navStep = design[stage].navStep;
    let buttons = design[stage].buttons;
    let visibleState = design[stage].visibleState;
    let oldActive = design.filter(d => { if (d.active) return true })[0]
    if (oldActive) oldActive.active = false;
    design[stage].active = true;
    btnShowing.forEach(button => {
        button.style.display = "none";
    });
    buttons.forEach(btn => {
        document.querySelector(`ul.buttons button.${btn}`).style.display = "block";
    });
    document.querySelector(".user-step > .step.active").classList.remove("active");
    document.querySelectorAll(".user-step > .step")[navStep].classList.add("active");
    contents[stage].style.display = visibleState;
}

function getToTotal() {
    let pickedPlan = document.querySelector(".picked-plan"),
    period = user.period,
    attr = stock[period + "Attr"],
    totalPrice = 0;
    pickedPlan.querySelector(".name").textContent = `${user.plan.name} (${period})`
    pickedPlan.querySelector(".price").textContent = `+$${user.plan[`${period}Price`]}/` + stock[`${period}Attr`]
    pickedPlan.querySelector("ul.selected-add-ons").innerHTML = "";
    totalPrice += user.plan[`${period}Price`];
    if (user.addOns) {
        user.addOns.forEach(addOn => {
            totalPrice += addOn[period + "Price"]
            pickedPlan.querySelector("ul.selected-add-ons").innerHTML += `<li><h3 class="name">${addOn.name}</h3><span class="price plus">+$${addOn[period + "Price"]}/${attr}</span></li>`
        })
    }
    document.querySelector(".total > .price").textContent = `+$${totalPrice}/${attr}`
}

function takeUserNotes(stage) {
    if (stage === 0) {
        let userInputs = document.querySelectorAll(".input-field");
        user.fullName = userInputs[0].value;
        user.mail = userInputs[1].value;
        user.telNumber = userInputs[2].value;
    }
    else if (stage === 1) {
        let sequence = document.querySelector(".plan.active > .price").dataset.sequence,
            period = "monthly";
        if (document.querySelector("input#period").checked) { period = "yearly" } else { period = "monthly" };
        user.plan = stock.plans[sequence];
        user.period = period;
        
    }
    else if (stage === 2) {
        user.addOns = [];
        document.querySelectorAll(".tab > input[type='checkbox']").forEach(tabCheckbox => {
            if (tabCheckbox.checked) {
                let sequence = parseInt(tabCheckbox.dataset.sequence);
                user.addOns.push(stock.addOns[sequence]);
            }
        })
        getToTotal()
    }
}


btnShowing.forEach(btn => {
    if (btn.dataset.action === "next") {
        btn.onclick = e => {
            let form = document.querySelector("form");
            if (form) {
                if (form.checkValidity()) {
                    let stage = design.filter(d => { if (d.active) return true })[0].stage
                    takeUserNotes(stage)
                    mainStep(stage + 1)
                }
                else {
                    form.classList.add("error")
                }
            }
        }
    }
    else if (btn.dataset.action === "back") {
        btn.onclick = e => {
            mainStep(design.filter(d => { if (d.active) return true })[0].stage - 1)
        }
    }
})

document.querySelector("button[type='reset'].change").onclick = () => {
    mainStep(1)
}

mainStep()