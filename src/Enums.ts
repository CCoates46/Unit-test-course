

enum AuthError {
    WRONG_CREDENTIALS,
    SERVER_FAIL,
    EXPIRED_SESSION,
    UNEXPECTED_ERROR
}

enum AuthError2 {
    WRONG_CREDENTIALS = 'wrong credentials',
    SERVER_FAIL = 'server fail',
    EXPIRED_SESSION = 'expired session'
}

function handleError(error: AuthError) {
    switch (error) {
        case AuthError.EXPIRED_SESSION:
            console.log('Get a new session!')
            break
        case AuthError.SERVER_FAIL:
            console.log('Restart the server!')
            break
        case AuthError.WRONG_CREDENTIALS:
        case AuthError.UNEXPECTED_ERROR:
            console.log('Check your input!')
            break
        default:
            break
    }
}

handleError(AuthError.SERVER_FAIL)