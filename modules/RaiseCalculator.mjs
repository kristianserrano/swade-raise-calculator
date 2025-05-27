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
        screen: {
            template: 'modules/swade-raise-calculator/templates/screen.hbs',
        },
        buttons: {
            template: 'modules/swade-raise-calculator/templates/buttons.hbs',
            scrollable: ['.number-grid']
        },
    };

    get title() {
        return game.i18n.format('SWADERaiseCalculator.Title');
    }

    async _prepareContext(options = {}) {
        const context = options;
        return context;
    }

    async _preparePartContext(partId, context) {
        switch (partId) {
            case 'screen':
                context.comparison = this.comparison || context.comparison;
                context.description = this.description || context.description;
                context.screenTheme = game.settings.get('swade-raise-calculator', 'screen-theme');
                context.brightness = game.settings.get('swade-raise-calculator', 'screen-brightness');
                break;
            case 'buttons':
                this.clickCount = this.clickCount || context.clickCount;
                this.selectedValues = this.selectedValues || [];
                this.numbers = [];
                const rows = game.settings.get('swade-raise-calculator', 'row-count');

                for (let i = 0; i < rows * 4; i++) {
                    this.numbers.push({
                        value: i + 1,
                        id: i + 1,
                        selected: this.selectedValues.includes(i + 1)
                    });
                }

                context.selectedValues = this.selectedValues;
                context.numbers = this.numbers;
                break;
        }

        return context;
    }

    static processInput(event, target) {
        if (this.selectedValues.length === 2) {
            this.selectedValues.length = 0;
        }

        const number = Number(target.dataset.number);

        if (this.clickCount === 0) {
            const previouslyClickedButtons = target.parentElement.querySelectorAll('.clicked');

            for (const button of previouslyClickedButtons) {
                button.classList.remove('clicked');
            }
        }

        this.clickCount++;
        this.selectedValues.push(number);

        if (this.clickCount === 2) {
            this.clickCount = 0;
        }

        if (this.selectedValues.length === 2) {
            this.raises = this.calculateRaises();
            let sign = '';

            if (this.raises === 0) {
                if (this.selectedValues[1] >= this.selectedValues[0]) {
                    this.description = game.i18n.localize('SWADERaiseCalculator.Calculator.Success');
                    sign = this.selectedValues[1] === this.selectedValues[0] ? '=' : '>';
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
                    "roll": this.selectedValues[1],
                    "sign": sign,
                    "tn": this.selectedValues[0]
                });

            const output = target.parentElement.parentElement.querySelector('.screen');
            output.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            this.comparison = '';
            this.description = '';
        }

        this.render({
            selectedValues: this.selectedValues,
            raises: this.raises,
            comparison: this.comparison,
            description: this.description,
            clickCount: this.clickCount,
        });
    }

    calculateRaises() {
        let raises = Math.floor((this.selectedValues[1] - this.selectedValues[0]) / 4);

        if (raises < 0) {
            raises = 0;
        }

        return raises;
    }

}
