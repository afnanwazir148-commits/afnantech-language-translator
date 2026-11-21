// Grab DOM elements we'll need

const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

// Populate both language dropdowns

selectTag.forEach((tag, id) => {

    let sortedCodes = Object.keys(countries).sort((a, b) =>
        countries[a].localeCompare(countries[b])
    );

    sortedCodes.forEach(country_code => {

        let selected = "";

        if (id === 0 && country_code === "en-GB") {
            selected = "selected";
        }

        if (id === 1 && country_code === "ur-PK") {
    selected = "selected";
}

        let option = `
            <option ${selected} value="${country_code}">
                ${countries[country_code]}
            </option>
        `;

        tag.insertAdjacentHTML("beforeend", option);

    });

});

// Swap languages and text

exchangeIcon.addEventListener("click", () => {

    let tempText = fromText.value;
    let tempLang = selectTag[0].value;

    fromText.value = toText.value;
    toText.value = tempText;

    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;

});

// Clear translation when source text is deleted

fromText.addEventListener("keyup", () => {

    if (!fromText.value) {
        toText.value = "";
    }

});

// Main translation function

translateBtn.addEventListener("click", () => {

    let text = fromText.value.trim();

    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;

    if (!text) return;

    toText.setAttribute("placeholder", "Translating...");

    // MyMemory Translation API

    let apiUrl =
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

    fetch(apiUrl)

        .then(res => {

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            return res.json();

        })

        .then(data => {

            toText.value = data.responseData.translatedText;

            toText.setAttribute("placeholder", "Translation");

        })

        .catch(error => {

            console.error("Translation error:", error);

            toText.setAttribute(
                "placeholder",
                "Translation failed. Try again."
            );

        });

});

// Copy and text-to-speech functionality

icons.forEach(icon => {

    icon.addEventListener("click", ({ target }) => {

        if (!fromText.value || !toText.value) return;

        let targetType = target.getAttribute("data-type");
        let action = target.getAttribute("data-action");

        // Copy text

        if (action === "copy") {

            if (targetType === "from") {

                navigator.clipboard.writeText(fromText.value);

            } else {

                navigator.clipboard.writeText(toText.value);

            }

        }

        // Text to speech

        else {

            let utterance;

            if (targetType === "from") {

                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;

            } else {

                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;

            }

            speechSynthesis.speak(utterance);

        }

    });

});