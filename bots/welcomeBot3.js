// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Import required Bot Framework classes.
const {  ConversationState, MemoryStorage, UserState } = require('botbuilder');

const { ActivityHandler, CardFactory, ActionTypes, ActivityTypes } = require('botbuilder');

// Welcomed User property name
const WELCOMED_USER = 'welcomedUserProperty';
//MYSQL//MYSQL//MYSQL//MYSQL//MYSQL//MYSQL//MYSQL//MYSQL//MYSQL//MYSQL//MYSQL

const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
//var session = require('express-session');
var path = require('path');
var app = express();



//var InputCard = require('../resources/UserPsw.json');
//const InputCard = require('../resources/UserPsw.json');
const InputCard = require('../UserPsw.json');
const InputCard2 = require('../resources/MeineTermine.json');
const InputCard3 = require('../resources/FaqCard.json');
const InputCard4 = require('../resources/Termine.json');
const IntroCard = require('../resources/InputCard.json');
const InputCard5 = require('../resources/Register.json');
//const InputCard = require('../resources/UserPsw.json');
const CARDZ = [
    IntroCard
];
const CARDS = [
    InputCard
];
const CARDS2 = [
    InputCard2
];
const CARDS3 = [
    InputCard3
];
const CARDS4 = [
    InputCard4
];
const CARDS5 = [
    InputCard5
];

//Configuring express server
app.use(express.json());
app.use(bodyparser.json());


const { DispatchBot } = require('../bots/dispatchBot');



class WelcomeBot extends ActivityHandler {
    /**
     * @param {any} logger object for logging events, defaults to console if none is provided
     * @param {UserState} User state to persist boolean flag to indicate
     *                    if the bot had already welcomed the user
     */
     
    //constructor(userState, logger, languagePreferenceProperty) {
    constructor(userState, logger) {
        super();

        let bot = new DispatchBot(logger);
        // Creates a new user property accessor.
        // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
        this.userState = userState;

       // const IntroCard = CARDZ[0];
        this.onMessage(async (context, next) => {
           
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
           const IntroCard = CARDZ[0];
            if (didBotWelcomedUser === false) {
            
        context.sendActivity == this.InputCard;
                // Set the flag indicating the bot handled the user's first message.
                await this.welcomedUserProperty.set(context, true);
            } else {
                // This example uses an exact match on user's input utterance.
                // Consider using LUIS or QnA for Natural Language Processing.
                let text = context.activity.text;
                // const SelectedCard = CARDS[Math.floor((CARDS.length) + 1)];
                const SelectedCard = CARDS[0];
                const SelectedCard2 = CARDS2[0];
                const SelectedCard3 = CARDS3[0];
                const SelectedCard4 = CARDS4[0];
                //const SelectedCard5 = CARDS5[0];
                switch (text) {
                    case 'hello': await context.sendActivity() == this.InputCard;
                    case 'hi':
                        await context.sendActivity(`You said "${context.activity.text}"`);
                        break;
                    case 'intro': await context.sendActivity(context.activity == this.InputCard);


                    case 'login':
                        /* await this.processLogin(context);
                         break;*/

                      /*  await context.sendActivity({

                            text: 'Login you choose :P',
                            attachments: [CardFactory.adaptiveCard(SelectedCard)]

                        });*/
                      await this.processLogin(context);

                        break;
                    case 'Registrieren':
                        await this.register(context);
                        break;

                    case 'termin':
                        await context.sendActivity({
                            text: 'Here is an Adaptive Card:',
                            attachments: [CardFactory.adaptiveCard(SelectedCard2)]
                        });
                        break;
                    case 'Meine Termine':
                        await context.sendActivity({
                            text: 'Here is an Adaptive Card:',
                            attachments: [CardFactory.adaptiveCard(SelectedCard4)]
                        });
                        break;
                    case 'F.A.Q':
                        await this.faq(context);
                       
                      /*  await context.sendActivity({
                            text: 'Here is an Adaptive Card:',
                            attachments: [CardFactory.adaptiveCard(SelectedCard3)]
                        });*/
                       // await module.DispatchBot();
                        break;
                    case ' ':
                        await context.sendActivity({
                            text: 'Here is an Adaptive Card:',
                            attachments: [CardFactory.adaptiveCard(IntroCard)]
                        });
                        break;


                  default:
                       await context.sendActivity({
                            text: 'Here is an Adaptive Card:',
                            attachments: [CardFactory.adaptiveCard(IntroCard)]
                        });
                //  await context.sendActivity(`willkomen zur Chatbot Bitter drück "enter"`);

                }
            }

            // Save state changes
            await this.userState.saveChanges(context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();

        });


        // Sends welcome messages to conversation members when they join the conversation.
        // Messages are only sent to conversation members who aren't the bot.
        this.onMembersAdded(async (context, next) => {
            // Iterate over all new members added to the conversation

            for (let idx in context.activity.membersAdded) {
                // Greet anyone that was not the target (recipient) of this message.
                // Since the bot is the recipient for events from the channel,
                // context.activity.membersAdded === context.activity.recipient.Id indicates the
                // bot was added to the conversation, and the opposite indicates this is a user.
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {

                }
            }
            const membersAdded = context.activity.membersAdded;
         /*   for (let idx in context.activity.membersAdded) {
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                }
            }*/
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('willkomen zur Chatbot Bitter drück "enter"');
                }
            }
           // await next();
        });


    }



    async processLogin() {
        this.onMessage(async (context, next) => {
            // Read UserState. If the 'DidBotWelcomedUser' does not exist (first time ever for a user)
            // set the default to false.                  {
            const SelectedCard = CARDS[0];
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
            const fs = require('fs');

            if (context.activity.text === "login") {
                await context.sendActivity({ attachments: [CardFactory.adaptiveCard(SelectedCard)] });
            } else if (context.activity.value != undefined) {
                var name = context.activity.value;
               // var z = JSON.parse(name);
              //  console.log(z);
               var password = context.activity.value;
                //await context.sendActivity("hello , your username : " + name.username + ",password : " + password.password);
                await context.sendActivity(name.username + password.password );
               // var z = JSON.parse(name);
                let zz = JSON.stringify(name);
                let xx = JSON.stringify(password);
                var z = JSON.parse(zz);
                var x = JSON.parse(xx);
                console.log(zz);
                console.log(xx);
                console.log(z);
                console.log(xx);
            } else {
                await context.sendActivity("send login to do test");
            }
            this.onMembersAdded(async (context, next) => {
                const membersAdded = context.activity.membersAdded;
                for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                    if (membersAdded[cnt].id !== context.activity.recipient.id) {
                        await context.sendActivity('Hello and welcome!');
                    }
                }
                // By calling next() you ensure that the next BotHandler is run.
                await next();
            });

            app.post('/id', (req, res) => {

                // let emp = req.body;
                app.use(express.json());
                app.use(express.urlencoded({ extended: true }));
                const fs = require('fs');

                console.log(z);
                console.log(x);
               // console.log(txt);
              res.send(z && x);


                mysqlConnection.query("INSERT INTO users(name, password) VALUES('" + z + " , "+ x +" ')", function (err, res) {
                    if (err) throw err;
                    app.use(express.json());
                    app.use(express.urlencoded({ extended: true }));
                    console.log("Yeah! record inserted");

                    // console.log(zz);
                 // console.log(z);
                    //console.log(JSON.parse(z));
                  //res.send(z);
                    //console.log(zzzz);
              });

           // result.send(name2);
                //res.send(req.body);

                // await next();
          }); 

           

            /*
                    const SelectedCard2 = CARDS2[0];
                    this.onTurn(async (context, next, req, res) => {
                        let txt = `"${context.activity.text}"`;
            
                        if (txt) {
                            var name = JSON.parse(txt);
                            // console.log(txt)
                            console.log(name)
                            // response.send('user ' + request.params.id);
                            res = name;
                            console.log(res)
            
                        }
                       await context.sendActivity({
                            text: 'bitte Passwort geben'
                        })
                        let txt2 = `"${context.activity.text}"`;
                        if (txt2) {
                            var password = JSON.parse(txt2);
                            console.log(password)
                            res = password;
                          }
                       
                        await next();
            
                        this.onTurn(async (context, next) => {
                            await context.sendActivity({
                                text: 'bitte Stribt'
                            })
                            let txt2 = `"${context.activity.text}"`;
                            if (txt2) {
                                var password = JSON.parse(txt2);
            
                                console.log(password)
                                res = password;
                                console.log(password)
            
                            } await next();
                        });
                    });
             */

            /* return context.sendActivity({
                 text: 'bitte passwort geben'
             })*/


            // await next();


            /*  if (password) {
  
                  await context.sendActivity({
                      text: 'Here is an Adaptive Card:',
                      attachments: [CardFactory.adaptiveCard(SelectedCard2)]
                  });
              }*/

            /*          
                     app.post('/id', async (req, res,context, next) => {
                            app.use(express.json());
                           app.use(express.urlencoded({ extended: true }));
                           const fs = require('fs');
           
                           console.log(name);
                           console.log(password);
           
                        
                        
                        // await next();
                           // res.send(name);
                           // res.send(password);
           
                           mysqlConnection.query("INSERT INTO users(name, password) VALUES('" + name + "','" + password + "')", function (err, result, rows) {
                               if (err) throw err;
                               res.send(rows);
                               //res.send(password);
                               console.log("Yeah! record inserted");
                               // console.log(zz);
                               // console.log(name);
                               // res.send(rows);
                               // console.log(password);
                           });
           
                       });
            */


            //       });

            /* this.onTurn(async (context, next, req, res) => {
                 await context.sendActivity({
                     text: 'bitte Passwort geben'
                 })
                 let txt2 = `"${context.activity.text}"`;
                 if (txt2) {
                     var password = JSON.parse(txt2);
                     console.log(txt2)
                     console.log(password)
                 }
     
                 await next();
                
             });*/
            /* app.post('/id', (req, res) => {
     
                 // let emp = req.body;
                 app.use(express.json());
                 app.use(express.urlencoded({ extended: true }));
                 const fs = require('fs');
     
                 console.log(this.name);
                 console.log(password);
     
                 // res.send(name);
                 // res.send(password);
     
                 mysqlConnection.query("INSERT INTO users(name, password) VALUES('" + name + "','" + password + "')", function (err, result) {
                     if (err) throw err;
                     res.send(rows);
                     console.log("Yeah! record inserted");
                     // console.log(zz);
                    // console.log(name);
                    // res.send(rows);
                    // console.log(password);
                 });
     
             });  */
            /* this.onTurn(async (context, next, req, res) => {
                  let txt2 = `"${context.activity.text}"`;
                  await context.sendActivity({
                      text: 'bitte passwort geben'
                  })
                  if (txt2) {
                      var password = JSON.parse(txt2);
                      console.log(password)
                     
                  }
                  await context.sendActivity({
                      text: 'GREAT!!!! [°_°]'
                  })
                  await next();
              });*/

        }
        )
    }

    async register(context, req, res) {
        //8888888888888

        const { DialogBot } = require('../bots/dialogBot');
       const { UserProfileDialog } = require('../dialogs/userProfileDialog');

       

        const logger = console;
        const memoryStorage = new MemoryStorage();
        const conversationState = new ConversationState(memoryStorage);
        const userState = new UserState(memoryStorage);
        const dialog = new UserProfileDialog(userState, logger);
        const bot = new DialogBot(conversationState, userState, dialog, logger);
  
        var fs = require('fs');
        eval(fs.readFileSync('./dialogs/userProfileDialog.js') + '');
        // 10 - 09 - 2019
       this.onTurn(async (context, next, req, res) => {
          /*  let txt = `"${context.activity.text}"`;

            // let text = context.activity.text;
            if (txt) {
                // var name = JSON.parse(txt.value._name);
                var name = JSON.parse(txt);
                //  console.log(name)
                console.log(txt)
                console.log(name)
                // let data = JSON.stringify(name);
            }*/
         // 10 - 09 - 2019
    
               await bot.run(context);

               //bot1.onTurn(context);

        }
           
    )};


    async faq(context,logger) {
        const { DispatchBot } = require('./dispatchBot');
        let bot = new DispatchBot(logger);
        await bot.run(context);
       // const SelectedCard3 = CARDS3[0];
       
       /* await context.sendActivity({
            text: 'Here is an Adaptive Card:',
            attachments: [CardFactory.adaptiveCard(SelectedCard3)]
        });*/
       
       // eval(fs.readFileSync('./dispatchBot.js') + '');
    }
}
/*const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));*/





module.exports.WelcomeBot = WelcomeBot;
