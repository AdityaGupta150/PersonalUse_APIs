const checkStatus = (res) => {
    //3xx -> Redirection
    /*We needed to check this, since
    NOTE: 3xx-5xx responses are NOT exceptions, and should be handled in then()
    (so, even unautherised requests, wont throw any exception)*/
    if(res.ok)  //ie. res.status>=200 && res.status<300
        return res
    else throw new Error('Contains client(4xx) or server(5xx) error status code ->', res.status)
}

module.exports = checkStatus