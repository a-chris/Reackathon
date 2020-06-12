import axios from 'axios';

export function getAvailableCities(): Promise<string[]> {
    return new Promise((resolve, reject) =>
        axios
            .get('http://localhost:5000/filters/cities')
            .then((response: any) => resolve(response.data))
            .catch((error: any) => reject(error))
    );
}
