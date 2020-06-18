import axios from 'axios';

axios.defaults.withCredentials = true;

/**
 * Debug
 */
axios.interceptors.request.use((request) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Starting Request', request);
    }
    return request;
});

axios.interceptors.response.use((response) => {
    if (process.env.NODE_ENV === 'development') {
        console.log('Response:', response);
    }
    return response;
});
