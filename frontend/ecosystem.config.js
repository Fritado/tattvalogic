module.exports = {
    apps: [
        {
            name: "tattvalogic-web",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 30006",
            cwd: "./",
            instances: "max", // Utilizes all available CPU cores for Next.js SSR
            exec_mode: "cluster",
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
                PORT: 30006,
            },
        },
    ],
};
