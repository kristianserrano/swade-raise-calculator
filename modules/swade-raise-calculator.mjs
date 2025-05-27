import { RaiseCalculator } from "./RaiseCalculator.mjs";

//CONFIG.debug.hooks = true;

Hooks.on('init', () => {
    game.settings.register('swade-raise-calculator', 'row-count', {
        name: `SWADERaiseCalculator.Settings.RowCount.Name`,
        hint: `SWADERaiseCalculator.Settings.RowCount.Hint`,
        scope: 'world',
        config: true,
        type: Number,
        default: 6,
        onChange: () => {
            foundry.applications.instances.get('swade-raise-calculator')?.render(false);
        }
    });

    game.settings.register('swade-raise-calculator', 'screen-theme', {
        hint: 'SWADERaiseCalculator.Settings.ScreenTheme.Hint',
        name: 'SWADERaiseCalculator.Settings.ScreenTheme.Name',
        scope: 'client',
        type: String,
        default:'grey',
        choices: {
            'grey': game.i18n.localize('SWADERaiseCalculator.Settings.ScreenTheme.Themes.Grey'),
            'green': game.i18n.localize('SWADERaiseCalculator.Settings.ScreenTheme.Themes.Green'),
            'red': game.i18n.localize('SWADERaiseCalculator.Settings.ScreenTheme.Themes.Red'),
            'amber': game.i18n.localize('SWADERaiseCalculator.Settings.ScreenTheme.Themes.Amber'),
            'amber-dark': game.i18n.localize('SWADERaiseCalculator.Settings.ScreenTheme.Themes.AmberDark'),
            'indiglo': game.i18n.localize('SWADERaiseCalculator.Settings.ScreenTheme.Themes.Indiglo'),
        },
        config: true,
        onChange: () => {
            foundry.applications.instances.get('swade-raise-calculator')?.render();
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
