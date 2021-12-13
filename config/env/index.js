function getEnv(name, defaultValue = "defaultValue") {
    if (process.env[name] !== "" && process.env[name] !== undefined) {
        return process.env[name];
    }
    return defaultValue;
}
module.exports = {
    MONGO_URL: getEnv("URL_MONGO", "URL_MONGO")
}