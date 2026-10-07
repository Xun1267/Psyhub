/* Shared validation for saved calendars and imported backups. */
window.CalendarData = (() => {
    const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    const fail = () => { throw new Error('备份结构不完整或包含无效数据'); };
    const text = (value, limit = 100000) => {
        if (typeof value !== 'string' || value.length > limit) fail();
        return value;
    };
    const escape = value => String(value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
    function richText(value) {
        const template = document.createElement('template');
        template.innerHTML = text(value);
        const allowed = new Set(['DIV', 'P', 'BR', 'SPAN', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'UL', 'OL', 'LI', 'FONT']);
        const blocked = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH']);
        function clean(node) {
            if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent);
            const fragment = document.createDocumentFragment();
            if (node.nodeType !== Node.ELEMENT_NODE || blocked.has(node.tagName)) return fragment;
            const result = allowed.has(node.tagName) ? document.createElement(node.tagName === 'FONT' ? 'span' : node.tagName.toLowerCase()) : fragment;
            if (result.nodeType === Node.ELEMENT_NODE) {
                for (const property of ['color', 'backgroundColor', 'fontWeight', 'fontStyle', 'textDecoration']) {
                    if (node.style[property]) result.style[property] = node.style[property];
                }
                if (node.tagName === 'FONT' && node.hasAttribute('color')) result.style.color = node.getAttribute('color');
            }
            for (const child of node.childNodes) result.append(clean(child));
            return result;
        }
        const container = document.createElement('div');
        for (const node of template.content.childNodes) container.append(clean(node));
        return container.innerHTML;
    }
    function validate(input) {
        if (!record(input) || (input.schemaVersion !== undefined && input.schemaVersion !== 1)) fail();
        if (!record(input.weekly) || !record(input.monthly) || !record(input.habits)) fail();
        if (!Array.isArray(input.customTimeBlocks) || input.customTimeBlocks.length > 100 || !input.customTimeBlocks.length) fail();
        const result = {schemaVersion: 1, weekly: {}, monthly: {}, habits: {}, customTimeBlocks: input.customTimeBlocks.map(v => text(v, 200))};
        for (const section of ['weekly', 'monthly']) {
            for (const [period, cells] of Object.entries(input[section])) {
                const validPeriod = section === 'weekly' ? /^\d{4}-W\d{1,2}$/.test(period) : /^\d{4}-M\d{1,2}$/.test(period);
                if (!validPeriod || !record(cells)) fail();
                result[section][period] = {};
                for (const [key, value] of Object.entries(cells)) {
                    if (!(section === 'weekly' ? /^\d+-[0-6]$/ : /^day-(?:[1-9]|[12]\d|3[01])$/).test(key)) fail();
                    result[section][period][key] = richText(value);
                }
            }
        }
        for (const [period, habits] of Object.entries(input.habits)) {
            if (!/^\d{4}-M\d{1,2}$/.test(period) || !Array.isArray(habits)) fail();
            result.habits[period] = habits.map(habit => {
                if (!record(habit) || !Array.isArray(habit.checks) || habit.checks.some(day => !Number.isInteger(day) || day < 1 || day > 31)) fail();
                return {name: text(habit.name, 2000), checks: [...new Set(habit.checks)]};
            });
        }
        return result;
    }
    return {validate, escape};
})();
