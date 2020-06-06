import axios from 'axios';

axios.defaults.withCredentials = true;

/**
 * Debug
 */
axios.interceptors.request.use((request) => {
    console.log('Starting Request', request);
    return request;
});

axios.interceptors.response.use((response) => {
    console.log('Response:', response);
    return response;
});
