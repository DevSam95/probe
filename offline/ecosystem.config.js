module.exports = {
    apps: [
        {
            name: "LVM_UI_Server",
            script: "serve",
            env: {
                PM2_SERVE_PATH: 'dist',
                PM2_SERVE_PORT: 9999
            },
            instances: 1,
            mode: "fork"
        },
        {
            name: "LVM_API_Server",
            script: "service/server.js",
            instances: 1,
            mode: "fork"
        }
    ]
}
