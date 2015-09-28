As a starting point I cloned the [MEAN.JS boilerplate](http://meanjs.org/)

My thought process is that it would be an easy starting point since it does initial configuration of Express, Mongo, Angular.  It did help with the initial configuration but in hindsight I am not sure I would have done it this way.
- There was some learning curve just to figure out the directory structure, build system, and initialization.  
- It took some time and amount of messing around to figure out how to make the grunt build system in the boilerplate compatible with the heroku deploy system.
- It is way over-kill.  I removed a lot of the boilerplate, but even still there are many extra things.  The original boilerplate include socket-io, facebook/twitter authentiation, and many other things I did not need.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli

To install Node.js dependencies you're going to use npm again. In the application folder run this in the command-line:

```bash
$ npm install
```

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)


## Detailed description:
The majority of the blackjack coding is found in /modules/blackjack

Both the client and server code are in there.

The overall design is:
Angular client front-end, that call REST api endpoints.
- There are three main front-end views:  landing page (new game), the main in progress game view, the game statistics page. /modules/blackjack/client/views
- The view models that the view bind to: /modules/blackjack/client/controllers
- The services that perform any front-end logic, and handle the REST api calls: /modules/blackjack/client/services

Express/Node back-end.
- Routes that map the REST api to the correct logic methods and response. /modules/blackjack/server/routes
- Logic layer that handle the actions, and data state changes. /modules/blackjack/server/controllers
- The game's state itself is persisted in a Mongo Db under an unique Id. /modules/blackjack/server/models
- Db layer that isolates all db queries from the game logic layer. /modules/blackjack/server/repository

Mongodb.
- Two collections are stored:
- GameResult - Every hand result is stored in the collection.  Who won the hand, the scores, the game id the hand was part of.
- Game - This is the collection where each game (table) is persisted.

Unfortuneately I overused the term "Game".
In most cases "Game" refers to the current Table.  A "Game" (table) consists a unique ID, a dealer, a player, a deck of cards.  This is what is persisted in the Game db collection.  When you request a new Game in the front-end it really is requesting a new Table, in which you can play multiple hands.  

"GameResult" - This really is a hand result for a given game table.

I chose to persist the Games in the db because this is a pretty common pattern for allowing multiple clients access to an API where each client will be working against their own unique IDs.  In this case multiple players on multiple clients all can be player their own unique games (tables).  

From a scaling standpoint, the common solution would be to use a load balancer accross however many node server instances are needed for the demand.   In the current design the game statistics do include an overall win/loss count.  If this was something desired in the longrun, the Mongo Db would need to be setup as a Replication Set.  Then each node instance would be connected to a replica of the primary database and share the same overall game stats.  

The main scaling flaw in the current design is that Game and GameRecords get written to the database but nothing ever cleans out and removes old entries.  Eventually the db will just fill up.  

This could be solved a couple ways:
- A worker just periodically runs and removes entries that are a certain age, or have not had any activity for a certain time period.
- When the db reaches a certain threshold of number documents that triggers a mass removal of old documents.

Future expansion:
- Adding multiple player to the same table.  I would do this using WebSockets, probably using the socket-io library.
- If each game did have socket connections, this also could trigger db cleanup on any game that no longer had connected clients. 
- User authentication.  Then users could keep track of their own win/loss records, and continue to play old games when then sign-in rather than being forced to start a new game.
- Also could cap the number of active games a user could have at one time as a solution to filling up the database with game results/records.


