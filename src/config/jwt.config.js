module.exports = {
    "accessToken":{
        "secret": process.env.JWT_ACCESS_TOKEN_SECRET,
        "expiresIn": process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
    },
    "refreshToken":{
        "secret": process.env.JWT_REFRESH_TOKEN_SECRET,
        "expiresIn": process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
    }
}