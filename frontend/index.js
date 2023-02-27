const GLOBAL = {};

async function initialize() {
    GLOBAL.focusDate = new Date();
    GLOBAL.profile = await getProfile();

    var profileDOM = document.querySelector("#profile");
    setProfileDOM(profileDOM, GLOBAL.profile);

    var calanderDOM = document.querySelector("#calander");
    setCalanderDOM(calanderDOM, GLOBAL.focusDate);

    calanderDOM.querySelectorAll(".calander-body-date-activatebtn")
               .forEach(radio => radio.addEventListener("change", async function() {
                   var changedDate = new Date(GLOBAL.focusDate.getTime());
                   changedDate.setDate(changedDate.getDate() - GLOBAL.focusBtnindex + +this.dataset.btnindex);

                   await changeFocusDate(changedDate);
               }));

    calanderDOM.querySelector("#calander-header-weekcontroler-inc")
               .addEventListener("click", async function() {
                   var changedDate = new Date(GLOBAL.focusDate.getTime());
                   changedDate.setDate(changedDate.getDate() + 7);

                   await changeFocusDate(changedDate);
               });

    calanderDOM.querySelector("#calander-header-weekcontroler-dec")
               .addEventListener("click", async function() {
                   var changedDate = new Date(GLOBAL.focusDate.getTime());
                   changedDate.setDate(changedDate.getDate() - 7);

                   await changeFocusDate(changedDate);
               });

    updateIncomeList(GLOBAL.focusDate);
    updateOutcomeList(GLOBAL.focusDate);

    var addIncomeForm = document.querySelector(".statistic:nth-child(4) form");
    addIncomeForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        if (!!this[1].value && !isNaN(this[2].value) && parseInt(this[2].value) === +this[2].value)
            await addIncome(this);
        else
            alert("Invalid parameter");
        return false;
    });

    var addOutcomeForm = document.querySelector(".statistic:nth-child(5) form");
    addOutcomeForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        if (!!this[1].value && !isNaN(this[2].value) && parseInt(this[2].value) === +this[2].value)
            await addOutcome(this);
        else
            alert("Invalid parameter");
        return false;
    });
}

async function getProfile() {
    return {
        name: "Paul", 
        image: "src/profile.jpg", 
        message: "hello world, my name is Paul :)"
    }
}

function setProfileDOM(profileDOM, profile) {
    profileDOM.querySelector("#profile-image img").src = profile.image;
    profileDOM.querySelector("#profile-info-name").dataset.profileName = profile.name;
    profileDOM.querySelector("#profile-info-message").dataset.profileMessage = profile.message;
}

function setCalanderDOM(calanderDOM, focusDate) {
    calanderDOM.querySelector("#calander-header-weekinfo").dataset.weekinfo = `${focusDate.getFullYear()}년 ${focusDate.getMonth()+1}월 ${getWeekNumberOfMonthOfTheDate(focusDate)}주차`;

    var firstDate = getFirstDateOfTheWeek(focusDate);
    for (let i=1; i<=7; i++) {
        var theDate = new Date(firstDate.getTime());
        theDate.setDate(theDate.getDate() + i - 1);

        if (theDate.getDate() === focusDate.getDate()) {
            var btn = calanderDOM.querySelector(`.calander-body-date:nth-child(${i}) .calander-body-date-activatebtn`);
            btn.click();
            GLOBAL.focusBtnindex = +btn.dataset.btnindex;
        }

        calanderDOM.querySelector(`.calander-body-date:nth-child(${i}) .calander-body-date-dateslot`).dataset.date = theDate.getDate();
    }
}

function getWeekNumberOfMonthOfTheDate(date) {
    var dateClone = new Date(date.getTime());
    var currDate = dateClone.getDate();
    var firstDay = new Date(dateClone.setDate(1)).getDay();

    return Math.ceil((currDate + firstDay)/7);
}

function getFirstDateOfTheWeek(date) {
    var dateClone = new Date(date.getTime());
    dateClone.setDate(dateClone.getDate() - dateClone.getDay());

    return dateClone;
}

async function changeFocusDate(date) {
    GLOBAL.focusDate = new Date(date.getTime());
    var calanderDOM = document.querySelector("#calander");
    setCalanderDOM(calanderDOM, GLOBAL.focusDate);

    await updateIncomeList(GLOBAL.focusDate);
    await updateOutcomeList(GLOBAL.focusDate);
}

async function getIncomeList(date) {
    var url = "https://rnlswyyu5fj4de3r3hjiencahq0arxtk.lambda-url.us-east-1.on.aws/";
    document.getElementById("modal").classList.toggle("unavailable");
    var res = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            url: "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-bgjek/endpoint/data/v1/action/find", 
            headers: {
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*", 
                "api-key": "FMGf4bnqZMFUCEp9RToJUlgp89czIu2kTMCQFNUaeFaKi90FNvTxxCwK8ZUszkC6"
            }, 
            body: {
                collection: "logs", 
                database: "rkrPqn", 
                dataSource: "Cluster0", 
                filter: {
                    type: "income", 
                    createdAt: date.toISOString().split("T")[0]
                }
            }
        })
    });
    var tmp = await res.json();
    document.getElementById("modal").classList.toggle("unavailable");
    return tmp.documents;
}

async function getOutcomeList(date) {
    var url = "https://rnlswyyu5fj4de3r3hjiencahq0arxtk.lambda-url.us-east-1.on.aws/";
    document.getElementById("modal").classList.toggle("unavailable");
    var res = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
            url: "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-bgjek/endpoint/data/v1/action/find", 
            headers: {
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*", 
                "api-key": "FMGf4bnqZMFUCEp9RToJUlgp89czIu2kTMCQFNUaeFaKi90FNvTxxCwK8ZUszkC6"
            }, 
            body: {
                collection: "logs", 
                database: "rkrPqn", 
                dataSource: "Cluster0", 
                filter: {
                    type: "outcome", 
                    createdAt: date.toISOString().split("T")[0]
                }
            }
        })
    });
    var tmp = await res.json();
    document.getElementById("modal").classList.toggle("unavailable");
    return tmp.documents;
}

async function updateIncomeList(date) {
    var incomeStatisticDOM = document.querySelector(".statistic:nth-child(4)");
    var incomeStatisticBodyDOM = incomeStatisticDOM.querySelector(".statistic-body");
    var incomes = await getIncomeList(date);

    while(incomeStatisticBodyDOM.firstChild)
        incomeStatisticBodyDOM.removeChild(incomeStatisticBodyDOM.firstChild);

    incomes.forEach(income => {
        var tmp = document.querySelector("#statistic-body-log-tmp");
        var incomeDOM = document.importNode(tmp.content, true);

        incomeDOM.querySelector(".statistic-body-log-removebtn")
                 .addEventListener("click", async function() {
                     removeIncome(this.parentElement);
                 })

        incomeDOM.querySelector(".statistic-body-log-title").dataset.title = income.title;
        incomeDOM.querySelector(".statistic-body-log-value").dataset.value = income.value.toLocaleString();
        incomeDOM.querySelector(".statistic-body-log-oid").dataset.oid = income._id;

        incomeStatisticBodyDOM.appendChild(incomeDOM);
    })

    incomeStatisticDOM.querySelector(".statistic-header-totalvalue").dataset.totalvalue = incomes.reduce((curr, prev) => curr + prev.value, 0).toLocaleString();
}

async function updateOutcomeList(date) {
    var outcomeStatisticDOM = document.querySelector(".statistic:nth-child(5)");
    var outcomeStatisticBodyDOM = outcomeStatisticDOM.querySelector(".statistic-body");
    var outcomes = await getOutcomeList(date);

    while(outcomeStatisticBodyDOM.firstChild)
        outcomeStatisticBodyDOM.removeChild(outcomeStatisticBodyDOM.firstChild);

    outcomes.forEach(outcome => {
        var tmp = document.querySelector("#statistic-body-log-tmp");
        var outcomeDOM = document.importNode(tmp.content, true);

        outcomeDOM.querySelector(".statistic-body-log-removebtn")
                  .addEventListener("click", async function() {
                      removeOutcome(this.parentElement);
                  })

        outcomeDOM.querySelector(".statistic-body-log-title").dataset.title = outcome.title;
        outcomeDOM.querySelector(".statistic-body-log-value").dataset.value = outcome.value.toLocaleString();
        outcomeDOM.querySelector(".statistic-body-log-oid").dataset.oid = outcome._id;

        outcomeStatisticBodyDOM.appendChild(outcomeDOM);
    })

    outcomeStatisticDOM.querySelector(".statistic-header-totalvalue").dataset.totalvalue = outcomes.reduce((curr, prev) => curr + prev.value, 0).toLocaleString();
}

async function addIncome(form) {
    document.getElementById("modal").classList.toggle("unavailable");
    var url = "https://2ek7ssl7mzxwhsohhe4mrqlx3y0gclxk.lambda-url.us-east-1.on.aws/";
    var res = await fetch(url, {
        method: "POST", 
        body: JSON.stringify({
            type: "income", 
            title: form[1].value, 
            value: +form[2].value, 
            createdAt: GLOBAL.focusDate.toISOString().split("T")[0]
        })
    })
    document.getElementById("modal").classList.toggle("unavailable");
    form[1].value = "";
    form[2].value = "";
    await updateIncomeList(GLOBAL.focusDate);
}

async function removeIncome(incomeDOM) {
    document.getElementById("modal").classList.toggle("unavailable");
    var url = "https://4j3ncotxm7nlsfa44wbteczux40knymo.lambda-url.us-east-1.on.aws/";
    var res = await fetch(url, {
        method: "POST", 
        body: JSON.stringify({
            oid: incomeDOM.querySelector(".statistic-body-log-oid").dataset.oid
        })
    })
    document.getElementById("modal").classList.toggle("unavailable");
    await updateIncomeList(GLOBAL.focusDate);
}

async function addOutcome(form) {
    document.getElementById("modal").classList.toggle("unavailable");
    var url = "https://2ek7ssl7mzxwhsohhe4mrqlx3y0gclxk.lambda-url.us-east-1.on.aws/";
    var res = await fetch(url, {
        method: "POST", 
        body: JSON.stringify({
            type: "outcome", 
            title: form[1].value, 
            value: +form[2].value, 
            createdAt: GLOBAL.focusDate.toISOString().split("T")[0]
        })
    })
    document.getElementById("modal").classList.toggle("unavailable");
    form[1].value = "";
    form[2].value = "";
    await updateOutcomeList(GLOBAL.focusDate);
}

async function removeOutcome(outcomeDOM) {
    document.getElementById("modal").classList.toggle("unavailable");
    var url = "https://4j3ncotxm7nlsfa44wbteczux40knymo.lambda-url.us-east-1.on.aws/";
    var res = await fetch(url, {
        method: "POST", 
        body: JSON.stringify({
            oid: incomeDOM.querySelector(".statistic-body-log-oid").dataset.oid
        })
    })
    document.getElementById("modal").classList.toggle("unavailable");
    await updateOutcomeList(GLOBAL.focusDate);
}


Promise.resolve()
        .then(initialize)