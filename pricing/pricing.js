// Copyright (c) Cratis. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

(() => {
    const money = amount => new Intl.NumberFormat('en-IE', {
        style: 'currency', currency: 'EUR',
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2
    }).format(amount);
    const options = document.querySelectorAll('.toggle-option');

    // Mirrors Showrunner's Pricing.TotalFor: a yearly period is twelve months less the yearly discount.
    const show = interval => {
        options.forEach(o => {
            const active = o.dataset.interval === interval;
            o.classList.toggle('active', active);
            o.setAttribute('aria-pressed', String(active));
        });

        document.querySelectorAll('.plan:not([data-contact])').forEach(plan => {
            const monthly = Number(plan.dataset.monthly);
            const discount = Number(plan.dataset.yearlyDiscount);
            const yearlyTotal = monthly * 12 * (100 - discount) / 100;
            const amount = interval === 'yearly' ? yearlyTotal / 12 : monthly;
            plan.querySelector('.amount').textContent = money(amount);
            plan.querySelector('.billed').textContent = interval === 'yearly'
                ? `Billed yearly at ${money(yearlyTotal)}`
                : 'Billed monthly';
        });
    };

    options.forEach(o => o.addEventListener('click', () => show(o.dataset.interval)));
})();
