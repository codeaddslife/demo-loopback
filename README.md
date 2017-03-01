# Developing a REST API with Loopback
[Loopback](http://loopback.io) was created as an open source mobile backend-as-a-service framework by 
[Strongloop](http://strongloop.com). It allows you to setup a REST API in minutes and is based on 
[Express]((http://expressjs.com)). 

Here we will use version 3.4.0 to build an API for camping reservations:

![DataModel](./datamodel.png)

## Getting Started
Loopback comes with a [CLI tool](https://loopback.io/doc/en/lb3/Command-line-tools.html) to generate an application. 
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
your browser to see a basic [Swagger-UI](http://swagger.io/swagger-ui/)

## Persistence
Look at server/datasources.json. We have no datasources configured yet. We will use an in-memory database here, 
but there are many [database connectors available](https://loopback.io/doc/en/lb3/Database-connectors.html) out-of-the-box. 

Type lb datasource to start the generator again.

```
? Enter the data-source name: reservationDS
? Select the connector for reservationDS: In-memory db (supported by StrongLoop)
Connector-specific configuration:
? window.localStorage key to use for persistence (browser only): 
? Full path to file for persistence (server only): db.json
```

The db.json file will persist the in-memory data to a file. This allows us to keep our data when we restart the server. 
It also allows us to start our application with some test data. 

We will create this file later on. Loopback won't give any warning when this file is not available yet. 

## Models
Loopback is designed around the concept of [models](https://loopback.io/doc/en/lb3/Defining-models.html). Let's create a model for our campground, `lb model`

```
? Enter the model name: campground
? Select the data-source to attach campground to: reservationDS (memory)
? Select model's base class PersistedModel
? Expose campground via the REST API? Yes
? Custom plural form (used to build REST URL): 
? Common model or server only? server
Let's add some campground properties now.

Enter an empty property name when done.
? Property name: name
   invoke   loopback:property
? Property type: string
? Required? Yes
? Default value[leave blank for none]: 

Let's add another campground property.
Enter an empty property name when done.
? Property name: location
   invoke   loopback:property
? Property type: geopoint
? Required? No
? Default value[leave blank for none]: 

Let's add another campground property.
Enter an empty property name when done.
? Property name: 
```

We created the campground model and derived it from the PersistedModel, so we can save it to our 
datasource. You can make a model common, which means that the same model can be shared between the client and the 
server, but we decided to use it for the server only. 

Our model has 2 properties, a name and a location. 
The id property is automatically included, so you don’t have to add it. 

Visit the API explorer at http://localhost:3000/explorer. You'll see a lot of endpoints available for our 
campgrounds now.  

![API Explorer](./explorer.png)

Let's test our API by getting all the campgrounds:

```
curl -X GET 'http://localhost:3000/api/campgrounds'
```

Since we don't have any data, the response will be an empty list. We now create the db.json file that we specified in 
the previous section. Create a db.json file at the root of the project. 

```
{
  "ids": {
    "campground": 5
  },
  "models": {
     "campground": {
       "1": "{\"name\":\"Salt Lake City KOA\",\"location\":{\"lat\": 40.772112, \"lng\": -111.932165},\"id\":1}",
       "2": "{\"name\":\"Gouldings Campground\",\"location\":{\"lat\": 37.006989, \"lng\": -110.214907},\"id\":2}",
       "3": "{\"name\":\"Grand Canyon Mather Campground\",\"location\":{\"lat\": 36.056472, \"lng\": -112.140728},\"id\":3}",
       "4": "{\"name\":\"Camping Paris Bois de Boulogne\",\"location\":{\"lat\": 48.868879, \"lng\": 2.234914},\"id\":4}"
     }
  }
}
```

Restart the server and try again. You should now see 4 campgrounds.
We will finish this part by generating our reservation model, lb model:

```
? Enter the model name: reservation
? Select the data-source to attach reservation to: reservationDS (memory)
? Select model's base class PersistedModel
? Expose reservation via the REST API? Yes
? Custom plural form (used to build REST URL): 
? Common model or server only? server
Let's add some reservation properties now.

Enter an empty property name when done.
? Property name: startDate
   invoke   loopback:property
? Property type: date
? Required? Yes
? Default value[leave blank for none]: 

Let's add another reservation property.
Enter an empty property name when done.
? Property name: endDate
   invoke   loopback:property
? Property type: date
? Required? Yes
? Default value[leave blank for none]: 

Let's add another reservation property.
Enter an empty property name when done.
? Property name: 
```

## Relations
Campgrounds can have zero or more reservations. We have to create a 
[relationship between our models](https://loopback.io/doc/en/lb3/Define-model-relations.html) to accomplish this, `lb 
relation`:

```
? Select the model to create the relationship from: campground
? Relation type: has many
? Choose a model to create a relationship with: reservation
? Enter the property name for the relation: reservations
? Optionally enter a custom foreign key: 
? Require a through model? No
```

Start the server again and go to the API Explorer. You will see some new endpoints for /campgrounds/{id}/reservations. 

Let’s update our test data so we have a couple of reservations for our campgrounds.

```
{
  "ids": {
    "campground": 5,
    "reservation": 2
  },
  "models": {
     "campground": {
       "1": "{\"name\":\"Salt Lake City KOA\",\"location\":{\"lat\": 40.772112, \"lng\": -111.932165},\"id\":1}",
       "2": "{\"name\":\"Gouldings Campground\",\"location\":{\"lat\": 37.006989, \"lng\": -110.214907},\"id\":2}",
       "3": "{\"name\":\"Grand Canyon Mather Campground\",\"location\":{\"lat\": 36.056472, \"lng\": -112.140728},\"id\":3}",
       "4": "{\"name\":\"Camping Paris Bois de Boulogne\",\"location\":{\"lat\": 48.868879, \"lng\": 2.234914},\"id\":4}"
     },
     "reservation": {
       "1": "{\"startDate\":\"2017-03-21\",\"endDate\":\"2017-03-23\",\"campgroundId\":1,\"id\":1}",
       "2": "{\"startDate\":\"2017-03-25\",\"endDate\":\"2017-03-31\",\"campgroundId\":2,\"id\":2}"
     }
  }
}
```

## Queries
Loopback endpoints can also be used to [query specific data](https://loopback.io/doc/en/lb3/Querying-data.html). 
Here’s a selection of what is possible out of the box:

- Show all campgrounds with ’KOA’ in there name  
  `/api/campgrounds?filter[where][name][like]=KOA`

- Show all reservations after or on 2017–03–22  
  `/api/reservations?filter[where][startDate][gte]=2017-03-22`

- Show only the names of the campgrounds:   
  `/api/campgrounds?filter[fields][name]=true`

- Show everything but the names of the campgrounds:  
  `/api/campgrounds?filter[fields][name]`

- Show campgrounds and include their reservations:  
  `/api/campgrounds?filter[include][reservations]`

- Show the first 2 campgrounds:  
  `/api/campgrounds?filter[limit]=2`

- Show the next 2 campgrounds:  
  `/api/campgrounds?filter[skip]=2&filter[limit]=2`

- Order campgrounds by name  
  `/api/campgrounds?filter[order]=name`

- Descending order campgrounds by name:  
  `/api/campgrounds?filter[order]=name%20DESC`

