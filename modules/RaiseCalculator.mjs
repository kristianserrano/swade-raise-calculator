const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class RaiseCalculator extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        tag: 'form',
        id: 'swade-raise-calculator',
        form: {
            closeOnSubmit: false,
            submitOnClose: false,
            submitOnChange: false,
        },
        actions: {
            processInput: RaiseCalculator.processInput,
        },
        position: {
            height: 380,
            width: 'auto',
        },
        window: {
            resizable: true,
        },
    };

    static PARTS = {
        raiseCalculator: {
            root: true,
            template: 'modules/swade-raise-calculator/templates/raise-calculator.hbs',
            scrollable: ['.number-grid']
        }
    };

    get title() {
        return game.i18n.format('SWADERaiseCalculator.Title');
    }

    async _prepareContext(options = {}) {
        const context = options;
        this.clickCount = options.clickCount || 0;
        this.values = options.values || [];
        context.numbers = [];
        const rows = game.settings.get('swade-raise-calculator', 'row-count');

        context.screenTheme = game.settings.get('swade-raise-calculator', 'screen-theme');

        for (let i = 0; i < rows * 4; i++) {
            context.numbers.push({
                value: i + 1,
                id: i + 1,
                selected: this.values.includes(i + 1)
            });
        }

        return context;
    }

    static processInput(event, target) {
        if (this.values.length === 2) {
            this.values.length = 0;
        }

        const number = Number(target.dataset.number);

        if (this.clickCount === 0) {
            const previouslyClickedButtons = target.parentElement.querySelectorAll('.clicked');

            for (const button of previouslyClickedButtons) {
                button.classList.remove('clicked');
            }
        }

        this.clickCount++;
        this.values.push(number);

        if (this.clickCount === 2) {
            this.clickCount = 0;
        }

        if (this.values.length === 2) {
            this.raises = this.calculateRaises();
            let sign = '';

            if (this.raises === 0) {
                if (this.values[1] >= this.values[0]) {
                    this.description = game.i18n.localize('SWADERaiseCalculator.Calculator.Success');
                    sign = this.values[1] === this.values[0] ? '=' : '>';
                } else {
                    this.description = game.i18n.localize('SWADERaiseCalculator.Calculator.Failure');
                    sign = '<';
                }
            } else {
                if (this.raises === 1) {
                    this.description = game.i18n.localize('SWADERaiseCalculator.Calculator.Raise');
                } else {
                    this.description = game.i18n.format('SWADERaiseCalculator.Calculator.Raises', { raises: this.raises });
                }

                sign = '>';
            }

            this.comparison = game.i18n.format('SWADERaiseCalculator.Calculator.Comparison',
                {
                    "roll": this.values[1],
                    "sign": sign,
                    "tn": this.values[0]
                });

            const output = target.parentElement.parentElement.querySelector('.output-container');
            output.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            this.comparison = '';
            this.description = '';
        }

        this.render({ values: this.values, raises: this.raises, comparison: this.comparison, description: this.description, clickCount: this.clickCount });
    }

    calculateRaises() {
        let raises = Math.floor((this.values[1] - this.values[0]) / 4);

        if (raises < 0) {
            raises = 0;
        }

        return raises;
    }

}
