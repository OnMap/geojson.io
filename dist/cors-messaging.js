const ALLOWED_HOSTS = [
    'http://localhost:8000',
    'https://onmap.github.io',
    'https://dumbledore.onmap.co.il',
    'https://dev-dumbledore.onmap.co.il'
];

function isAllowed(event) {
    return ALLOWED_HOSTS.indexOf(event.origin) !== -1;
}

window.addEventListener('message', function(event) {     
    if (!isAllowed(event)) {
        return;
    }
    
    const { action, params } = event.data;

    const actions = Object.keys(window.api.data).filter(key => typeof window.api.data[key] === 'function');

    if (actions.indexOf(action) === -1) {
        console.log(`Not supported map API action: "${action}"`);
        return;
    }

    // console.log((params.length) ? `Running ${action} with ${params.length} params (${params})` : `Running ${action}`);
    let result = null;
    let error = null;
    
    try {
        result = window.api.data[action](...params);
    } catch (err) {
        error = err;
    }
    parent && parent.postMessage({ action, result, error }, '*');
});