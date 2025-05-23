import { RaiseCalculator } from "./RaiseCalculator.mjs";

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
            foundry.applications.instances.get('swade-raise-calculator')?.render(false);
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
        const attributes = {
            'aria-label': game.i18n.localize('SWADERaiseCalculator.OpenCalculatorButton.AltText'),
            'role': 'button',
            'data-tooltip': game.i18n.localize('SWADERaiseCalculator.OpenCalculatorButton.AltText'),
        };

        for (const key in attributes) {
            rcButton.setAttribute(key, attributes[key]);
        }

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
