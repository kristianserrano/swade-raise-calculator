import { RaiseCalculator } from "./RaiseCalculatorV2.mjs";

//CONFIG.debug.hooks = true;

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

Hooks.on('renderSceneControls', (SwadeChatLog, html, options) => {
    if (!CONFIG.SWADERaiseCalculator) {
        CONFIG.SWADERaiseCalculator = new RaiseCalculator();
    }

    if (!html.querySelector('.open-raise-calc')) {
        const rcButton = document.createElement('button');
        rcButton.setAttribute('aria-label', game.i18n.localize('SWADERaiseCalculator.OpenCalculatorButton.AltText'));
        rcButton.setAttribute('role', 'button');
        rcButton.setAttribute('data-tooltip', game.i18n.localize('SWADERaiseCalculator.OpenCalculatorButton.AltText'));
        rcButton.classList.add('control', 'ui-control', 'layer', 'icon', 'fas', 'fa-calculator', 'open-raise-calc');
        rcButton.addEventListener('click', (e) => {
            e.preventDefault();
            CONFIG.SWADERaiseCalculator.render(true);
        });
        const li = document.createElement('li');
        li.appendChild(rcButton);
        html.querySelector('#scene-controls-layers').insertAdjacentElement("beforeend", li);
    }
});
