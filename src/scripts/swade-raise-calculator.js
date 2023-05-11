const outputElement = document.getElementById('output');
const titleElement = document.getElementById('title');
const numberGrid = document.getElementById('number-grid');
let clickCount = 0;
let values = [];
let description = '';

function calculateRaises(values) {
    let raises = Math.floor((values[1] - values[0]) / 4);
    if (raises < 0) {
        raises = 0;
    }

    return raises;
}

for (let i = 0; i < 60; i++) {
    const button = document.createElement('button');
    button.id = i + 1;
    button.classList.add('number-button');
    button.innerText = i + 1;
    button.addEventListener('click', function (e) {
        const number = parseInt(this.innerText);

        if (clickCount === 0) {
            const previouslyClickedButtons = numberGrid.querySelectorAll('.clicked, .tn');
            for (const button of previouslyClickedButtons) {
                button.classList.remove('clicked');
                button.classList.remove('tn');
            }
        }

        clickCount += 1;
        values.push(number);

        if (clickCount === 1) {
            this.classList.add('tn');
        } else if (clickCount === 2) {
            clickCount = 0;
        }

        if (values.length === 2) {
            outputElement.innerHTML = '';
            var raises = calculateRaises(values),
                description = '',
                result = document.createElement('h2'),
                input = `Roll ${values[1]} vs. TN ${values[0]}`;

            if (raises === 0) {
                if (values[1] >= values[0]) {
                    description = 'Success!';
                } else {
                    description = 'Failure!';
                }

                result.innerText = `${input} ${description}`;
            } else {
                if (raises === 1) {
                    description = 'raise!';
                } else {
                    description = 'raises!';
                }

                result.innerHTML = `
                    ${input}</br>
                    ${raises} ${description}
                    `;
            }

            outputElement.append(result);
            titleElement.scrollIntoView({ behavior: "smooth" });
            values = [];
        } else {
            outputElement.innerHTML = '';
        }

        this.classList.add('clicked');
    });

    numberGrid.append(button);
};
