
export class RaiseCalculator extends Application {
    constructor(options) {
        super(options);
        this.clickCount = 0;
        this.values = [];
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'swade-raise-calculator',
            title: 'Raise Calculator',
            template: `modules/swade-raise-calculator/templates/raise-calculator.hbs`,
            classes: ['swade-app'],
            height: 405,
            width: 200,
            closeOnSubmit: false,
            submitOnClose: false,
            submitOnChange: false,
            resizable: true,
        });
    }

    async _render(force = false, options = {}) {
        await super._render(force, options);
    }

    getData() {
        this.numbers = [];
        for (let i = 0; i < 60; i++) {
            this.numbers.push({
                value: i + 1,
                id: i + 1,
                selected: this.values.includes(i + 1)
            });
        }

        return this;
    }

    activateListeners(html) {
        for (const button of html[0].querySelectorAll('.number-button')) {
            button.addEventListener('click', this.processInput.bind(this));
        }
    }

    processInput(event) {
        if (this.values.length === 2) {
            this.values.length = 0;
        }

        const button = event.currentTarget;
        const number = Number(button.innerText);

        if (this.clickCount === 0) {
            const previouslyClickedButtons = button.parentElement.querySelectorAll('.clicked, .tn');

            for (const button of previouslyClickedButtons) {
                button.classList.remove('clicked');
                button.classList.remove('tn');
            }
        }

        this.clickCount ++;
        this.values.push(number);

        if (this.clickCount === 1) {
            button.classList.add('tn');
        } else if (this.clickCount === 2) {
            this.clickCount = 0;
        }

        if (this.values.length === 2) {
            this.raises = this.calculateRaises();
            this.comparison = `Roll ${this.values[1]} vs. TN ${this.values[0]}`;

            if (this.raises === 0) {
                if (this.values[1] >= this.values[0]) {
                    this.description = 'Success!';
                } else {
                    this.description = 'Failure!';
                }
            } else {
                if (this.raises === 1) {
                    this.description = 'Raise!';
                } else {
                    this.description = 'Raises!';
                }
            }
            const output = button.parentElement.parentElement.querySelector('.output-container');
            console.log(output.scrollTop)
            output.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            this.comparison = '';
            this.description = '';
        }

        this.render();
    }

    calculateRaises() {
        let raises = Math.floor((this.values[1] - this.values[0]) / 4);

        if (raises < 0) {
            raises = 0;
        }

        return raises;
    }

}
