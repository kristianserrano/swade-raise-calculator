import { RaiseCalculator } from "./RaiseCalculator.mjs";

//CONFIG.debug.hooks = true;

Hooks.on('init', () => {
    game.settings.register('swade-raise-calculator', 'max-buttons', {
        name: `SWADERaiseCalculator.Settings.MaxButtons.Name`,
        hint: `SWADERaiseCalculator.Settings.MaxButtons.Hint`,
        scope: 'world',
        config: true,
        type: Number,
        default: 24,
        range: {
            min: 24,
            step: 4
        },
        onChange: () => {
            foundry.applications.instances.get('swade-raise-calculator')?.render({ parts: ['buttons'] });
        }
    });

    game.settings.register('swade-raise-calculator', 'screen-theme', {
        hint: 'SWADERaiseCalculator.Settings.ScreenTheme.Hint',
        name: 'SWADERaiseCalculator.Settings.ScreenTheme.Name',
        scope: 'client',
        type: String,
        default: 'grey',
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
            foundry.applications.instances.get('swade-raise-calculator')?.render({ parts: ['screen'] });
        }
    });

    game.settings.register('swade-raise-calculator', 'screen-brightness', {
        hint: 'SWADERaiseCalculator.Settings.ScreenBrightness.Hint',
        name: 'SWADERaiseCalculator.Settings.ScreenBrightness.Name',
        scope: 'client',
        type: Number,
        default: 0.75,
        range: {
            min: 0.1,
            step: 0.05,
            max: 1,
        },
        config: true,
        onChange: () => {
            foundry.applications.instances.get('swade-raise-calculator')?.render({ parts: ['screen'] });
        }
    });

});

Hooks.on('setup', () => {
    // Preload the template and render the UI
    loadTemplates([
        'modules/swade-raise-calculator/templates/screen.hbs',
        'modules/swade-raise-calculator/templates/buttons.hbs',
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
