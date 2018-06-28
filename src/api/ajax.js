import HTTP from './HTTP'

/**
 * HTTP request method for four kinds of content type: form-data, x-www-form-urlencoded,
 * JSON, & binary data.
 *
 * @param url
 * @param method
 * @param data
 * @param resolve
 * @param reject
 * @return {Promise<any>} a promise instance to await
 */
export default function ajax({ url, method, data }) { // object destructuring, params
    return new Promise((resolve, reject) => {
        // async code
        switch (method) {
        case 'GET':
            HTTP.get(url)
                .then((response) => { // resolve the data
                    if (response.data.status) {
                        resolve(response.data) // resolve the data, again
                    } else {
                        reject(response.data.message)
                    }
                })
                .catch((err) => { // reject the data
                    reject(err) // reject the data
                })
            break
        case 'POST':
            HTTP.post(url, data)
                .then((response) => {
                    if (response.data.status) {
                        resolve(response.data)
                    } else {
                        reject(response.data.message)
                    }
                })
                .catch((err) => {
                    reject(err)
                })
            break
        case 'PUT':
        case 'DELETE':
        default:
            try {
                throw new TypeError('The request method is not allowed.')
            } catch (e) {
                console.error(e.message)
            }
        }
    })
}

