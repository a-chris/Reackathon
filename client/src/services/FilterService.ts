import axios from 'axios';

export function getAvailableCities(): Promise<string[]> {
    return new Promise((resolve, reject) =>
        axios
            .get('/filters/cities')
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}
