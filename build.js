({
    appDir: "./web/js/", // The top level directory that contains your app
    baseUrl: "./", // all modules are located relative to this path
    dir: "./web/js_min/", // The directory path to save the output
    modules: [// the modules that will be optimized
        {
            name: "web/js/app/index.js"
        }
    ]
})