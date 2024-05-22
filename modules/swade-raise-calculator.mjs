import { RaiseCalculator } from "./RaiseCalculator.mjs";

Hooks.on('init', () => {
    game.settings.register('swade-raise-calculator', 'row-count', {
        name: `SWADERaiseCalculator.RowCount.Name`,
        hint: `SWADERaiseCalculator.RowCount.Hint`,
        scope: 'world',
        config: true,
        type: Number,
        default: 6,
        onChange: () => {
            ui.windows['swade-raise-calculator']?.render(false);
        }
    });
});

Hooks.on('setup', () => {
    // Preload the template and render the UI
    loadTemplates([
        `modules/swade-raise-calculator/templates/raise-calculator.hbs`,
    ]);
});

Hooks.on('renderSwadeChatLog', (SwadeChatLog, html, options) => {
    if (!CONFIG.SWADERaiseCalculator) {
        CONFIG.SWADERaiseCalculator = new RaiseCalculator();
    }

    if (!html[0].querySelector('.open-raise-calc')) {
        const rcButton = document.createElement('a');
        rcButton.setAttribute('aria-label', game.i18n.localize('SWADERaiseCalculator.OpenCalculatorButton.AltText'));
        rcButton.setAttribute('role', 'button');
        rcButton.setAttribute('data-tooltip', game.i18n.localize('SWADERaiseCalculator.OpenCalculatorButton.AltText'));
        rcButton.classList.add('open-raise-calc');
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-calculator');
        rcButton.append(icon);
        rcButton.addEventListener('click', () => CONFIG.SWADERaiseCalculator.render(true));
        html[0].querySelector('#chat-controls .chat-control-icon').insertAdjacentElement("afterend", rcButton);
    }
});