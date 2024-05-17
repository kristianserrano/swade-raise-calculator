
export class RaiseCalculator extends Application {
    constructor(options) {
        super(options);
        this.clickCount = 0;
        this.values = [];
        this.appId = this.id;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: 'swade-raise-calculator',
            title: 'Raise Calculator',
            template: `modules/swade-raise-calculator/templates/raise-calculator.hbs`,
            classes: ['swade-app'],
            height: 365,
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
        const rows = game.settings.get('swade-raise-calculator', 'row-count');
        for (let i = 0; i < rows * 4; i++) {
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
        const number = Number(button.dataset.number);

        if (this.clickCount === 0) {
            const previouslyClickedButtons = button.parentElement.querySelectorAll('.clicked');

            for (const button of previouslyClickedButtons) {
                button.classList.remove('clicked');
            }
        }

        this.clickCount ++;
        this.values.push(number);

        if (this.clickCount === 2) {
            this.clickCount = 0;
        }

        if (this.values.length === 2) {
            this.raises = this.calculateRaises();
            this.comparison = game.i18n.format('SWADERaiseCalculator.Calculator.Comparison', { "roll": this.values[1], "tn": this.values[0]});

            if (this.raises === 0) {
                if (this.values[1] >= this.values[0]) {
                    this.description = game.i18n.localize('SWADERaiseCalculator.Calculator.Success');
                } else {
                    this.description = game.i18n.localize('SWADERaiseCalculator.Calculator.Failure');
                }
            } else {
                if (this.raises === 1) {
                    this.description = game.i18n.localize('SWADERaiseCalculator.Calculator.Raise');
                } else {
                    this.description = game.i18n.format('SWADERaiseCalculator.Calculator.Raises', {raises: this.raises});
                }
            }
            const output = button.parentElement.parentElement.querySelector('.output-container');
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
