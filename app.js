const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const conversionMsg = document.querySelector(".msg"); // Select the message div

// Populate dropdowns with options
for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update flag image based on selected currency
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Button click event listener
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const url = `https://currency-converter-pro1.p.rapidapi.com/convert?from=${fromCurr.value}&to=${toCurr.value}&amount=${amtVal}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'eda486aed0msh57c4716342658b5p11b98ejsna08dd3bcce13',
            'x-rapidapi-host': 'currency-converter-pro1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json(); // Parse response as JSON
        console.log(data); // Debugging: Log the API response

        if (data.success) {
            let rate=data.result;
            console.log(rate);
            // const message = `1 ${fromCurr.value} = ${conversionRate} ${toCurr.value}`;
            // let finalAmount=amtVal*rate;
            conversionMsg.innerText = `${amtVal} ${fromCurr.value} = ${rate} ${toCurr.value}`; // Update the message in UI
        } else {
            console.error("Conversion failed:", data.error.message);
            conversionMsg.innerText = "Conversion failed. Please try again.";
        }
    } catch (error) {
        console.error("Error fetching conversion data:", error);
        conversionMsg.innerText = "Error fetching conversion data. Please try again later.";
    }
});
