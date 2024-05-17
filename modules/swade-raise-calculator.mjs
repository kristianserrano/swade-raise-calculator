import { RaiseCalculator } from "./RaiseCalculator.mjs";

Hooks.on('setup', () => {
    // Preload the template and render the UI
    loadTemplates([
        `modules/swade-raise-calculator/templates/raise-calculator.hbs`,
    ]);
});

Hooks.on('ready', () => {
    const rc = new RaiseCalculator();

    const rcButton = document.createElement('a')
    rcButton.setAttribute('ariaLabel', 'Open Raise Calculator');
    rcButton.setAttribute('role', 'button');
    rcButton.setAttribute('data-tooltip', 'Open Raise Calculator');
    rcButton.classList.add('open-raise-calc');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-calculator');
    rcButton.append(icon);
    rcButton.addEventListener('click', () => rc.render(true));
    document.querySelector('#chat-controls .chat-control-icon')?.insertAdjacentElement("afterend", rcButton);
})