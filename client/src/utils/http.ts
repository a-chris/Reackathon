import axios from 'axios';

const getHeaders = () => {
    const token = '';
    return {
        headers: {
            'Authorization': token,
        },
    };
};

export function get(url: string, data?: {}): Promise<any> {
    return new Promise((resolve, reject) =>
        axios
            .get(url, data)
            .then((res: any) => resolve(res))
            .catch((error: any) => reject(error))
    );
}

export function post(url: string, data?: {}): Promise<any> {
    return new Promise((resolve, reject) =>
        axios
            .post(url, data, getHeaders())
            .then((res: any) => resolve(res))
            .catch((error: any) => reject(error))
    );
}
