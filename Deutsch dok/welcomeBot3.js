

// Importierung  die erforderlichen Bot Framework-Klassen.
const {  ConversationState, MemoryStorage, UserState } = require('botbuilder');

const { ActivityHandler, CardFactory, ActionTypes, ActivityTypes } = require('botbuilder');


const WELCOMED_USER = 'welcomedUserProperty';

//Position adaptiven Karte mit einem bestimmten Nutzungsdienst
const InputCard = require('../UserPsw.json');
const InputCard2 = require('../resources/MeineTermine.json');
const InputCard3 = require('../resources/FaqCard.json');
const InputCard4 = require('../resources/Termine.json');
const IntroCard = require('../resources/InputCard.json');
const InputCard5 = require('../resources/Register.json');

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


app.use(express.json());
app.use(bodyparser.json());


const { DispatchBot } = require('../bots/dispatchBot');



class WelcomeBot extends ActivityHandler {
    /**
     * @param {any} logger Objekt zum Protokollieren von Ereignissen, standardmäßig Konsole, wenn keine angegeben ist
     * @param {UserState} User 
     *                    
     */
     
    
    constructor(userState, logger) {
        super();

        let bot = new DispatchBot(logger);
        // Erstellt einen neuen Zugriffsmechanismus für Benutzereigenschaften.
        
        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
        this.userState = userState;

      
        this.onMessage(async (context, next) => {
           
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
           const IntroCard = CARDZ[0];
            if (didBotWelcomedUser === false) {
            
        context.sendActivity == this.InputCard;
                
                await this.welcomedUserProperty.set(context, true);
            } else {
                // genaue Übereinstimmung mit der Eingabeäußerung des Benutzers.
             
                let text = context.activity.text;
                
                const SelectedCard = CARDS[0];
                const SelectedCard2 = CARDS2[0];
                const SelectedCard3 = CARDS3[0];
                const SelectedCard4 = CARDS4[0];
               
                switch (text) {
                    case 'hello': await context.sendActivity() == this.InputCard;
                    case 'hi':
                        await context.sendActivity(`Sie haben gesagt "${context.activity.text}"`);
                        break;
                    case 'intro': await context.sendActivity(context.activity == this.InputCard);

						 break;
                    case 'Registrieren':
                        await this.register(context);
                        break;

                    case 'termin':
                        await context.sendActivity({
                            text: 'Termin,
                            attachments: [CardFactory.adaptiveCard(SelectedCard2)]
                        });
                        break;
                   
                    case 'F.A.Q':
                        await this.faq(context);
                       
                     
                        break;
                    case ' ':
                        await context.sendActivity({
                            text: 'Bitte eine Option auswählen',
                            attachments: [CardFactory.adaptiveCard(IntroCard)]
                        });
                        break;


                  default:
                       await context.sendActivity({
                            text: 'herzlich willkommen',
                            attachments: [CardFactory.adaptiveCard(IntroCard)]
                        });
               

                }
            }

            // Statusänderungen speichern
            await this.userState.saveChanges(context);

            // Durch den Aufruf von next () wird es sicher, dass der nächste BotHandler ausgeführt wird.
            await next();

        });


        // Sendet Begrüßungsnachrichten an Konversationsmitglieder, wenn diese an der Konversation teilnehmen.
        // Nachrichten werden nur an Konversationsmitglieder gesendet, die nicht der Bot sind.
        this.onMembersAdded(async (context, next) => {
            // Durchlaufen  alle neuen Mitglieder, die der Konversation hinzugefügt wurden

            for (let idx in context.activity.membersAdded) {
                
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {

                }
            }
            const membersAdded = context.activity.membersAdded;
         
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('willkomen zur Chatbot Bitter drück "enter"');
                }
            }
          
        });


    }

 async register(context, req, res) {
        //Aufrufen eines Bot-Dialogs
        const { UserProfileDialog } = require('../dialogs/userProfileDialog');
        const logger = console;
        const memoryStorage = new MemoryStorage();
        const conversationState = new ConversationState(memoryStorage);
        const userState = new UserState(memoryStorage);
        const dialog = new UserProfileDialog(userState, logger);
        const bot = new DialogBot(conversationState, userState, dialog, logger);
		//Kontext zu einem Modul liefern
        var fs = require('fs');
        eval(fs.readFileSync('./dialogs/userProfileDialog.js') + '');
       
       this.onTurn(async (context, next, req, res) => {
         await bot.run(context);

        }
           
    )};


    async faq(context,logger) {
		//QnA-Case-Dienstinitialisierung
        const { DispatchBot } = require('./dispatchBot');
        let bot = new DispatchBot(logger);
        await bot.run(context);
      
    }



	async processLogin() {
		this.onMessage(async (context, next) => {
			//                
			const SelectedCard = CARDS[0];
		   
			const fs = require('fs');

			if (context.activity.text === "login") {
				await context.sendActivity({ attachments: [CardFactory.adaptiveCard(SelectedCard)] });
			} else if (context.activity.value != undefined) {
				var name = context.activity.value;
			   
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
			  
			  });
	  
		  }); 

		}
		)
	}

   




module.exports.WelcomeBot = WelcomeBot;
