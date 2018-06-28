import Axios from 'axios';

const baseURL = process.env.API_ROOT;
const HTTP = Axios.create({
    baseURL,
    transformResponse: [
        data => JSON.parse(data),
    ],
    withCredentials: true,
});

export default HTTP;

export {
    baseURL,
};
