function fetchCSRFToken() {
    return fetch('http://127.0.0.1:8000/api/csrf/', {
        method: 'GET',
        credentials: 'same-origin',  // Ensures cookies are included
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch CSRF token');
        }
        return response.json();
    })
    .then(data => {
        const csrfToken = data.csrfToken;
        console.log('CSRF Token:', csrfToken);
        return csrfToken;
    })
    .catch(error => {
        console.error('Error fetching CSRF token:', error);
    });
}
