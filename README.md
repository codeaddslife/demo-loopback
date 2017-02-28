# Developing a REST API with Loopback
[Loopback](http://loopback.io) was created as an open source mobile backend-as-a-service framework by 
[Strongloop](http://strongloop.com). It allows you to setup a REST API in minutes and is based on 
[Express]((http://expressjs.com)). 

In this post we will use version 3.4.0 to build an API for camping reservations:

[DataModel](./datamodel.png)

## Getting Started
Loopback comes with a []CLI tool](https://loopback.io/doc/en/lb3/Command-line-tools.html) to generate an application. 
You can configure everything manually, but the CLI tool is just a really handy gift to get you started. Install it via 
the node package manager: `npm install -g loopback-cli`

When installed, type `lb to start the [yeoman-generator](http://yeoman.io):

```
     _-----_     
    |       |    ╭──────────────────────────╮
    |--(o)--|    │  Let's create a LoopBack │
   `---------´   │       application!       │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? What's the name of your application? reservations
? Enter name of the directory to contain the project: reservations
   create reservations/
     info change the working directory to reservations

? Which version of LoopBack would you like to use? 3.x (current)
? What kind of application do you have in mind? empty-server (An empty LoopBack API, without any configured models or datasources)
```

When finished, you will see the following project structure. The JSON files are for configuration and the Javascript 
files are for extending Express.


```
reservations/ 
├── client                       # Client JS, HTML and CSS files
│ └── README.md                  # Empty README.md file
├── package.json                 # Npm package specification
└── server                       # Node scripts and config 
 ├── boot                        # Initialization scripts
 │ └── root.js                   # Specify the contextroot
 ├── component-config.json       # Loopback components config
 ├── config.json                 # Global settings
 ├── datasources.json            # Datasource config
 ├── middleware.development.json # Middleware config for dev
 ├── middleware.json             # Middleware config
 ├── model-config.json           # Binds models to datasources
 └── server.js                   # Main application script
```

Go to the reservations folder and start the application by running npm start. Open http://localhost:3000/explorer in
your browser to see a basic [Swagger-UI](http://swagger.io/swagger-ui/)`

