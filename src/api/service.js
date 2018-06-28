import ajax from './ajax'

ajax({
    url: '/activityList',
    method: 'POST',
    data: {},
})
    .then(() => { // resolve the data

    })
    .catch(() => { // reject the data

    })
