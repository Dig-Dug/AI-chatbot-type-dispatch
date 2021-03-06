// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');


const { LuisRecognizer, QnAMaker } = require('botbuilder-ai');

//%%%%%%%%%%%%%%%%%%%5
/*const { ActivityHandler, ActionTypes, CardFactory, MessageFactory } = require('botbuilder');
const { TranslationSettings } = require('../translation/translationSettings');
const englishEnglish = TranslationSettings.englishEnglish;
const englishSpanish = TranslationSettings.englishSpanish;
const spanishEnglish = TranslationSettings.spanishEnglish;
const spanishSpanish = TranslationSettings.spanishSpanish;*/
//%%%%%%%%%%%%%%%%%%%5
//Configuring express server


class DialogBot extends ActivityHandler {
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {Dialog} dialog
     * @param {Object} languagePreferenceProperty Accessor for language preference property in the user state.
     * @param {any} logger object for logging events, defaults to console if none is provided
     */
   constructor(conversationState, userState, dialog, logger) {
    //constructor(conversationState, userState, dialog, logger, languagePreferenceProperty) {
        super();
        if (!conversationState) throw new Error('[DialogBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[DialogBot]: Missing parameter. userState is required');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');
        if (!logger) {
            logger = console;
            logger.log('[DialogBot]: logger not passed in, defaulting to console');
        }
//&&&&&&&&&&&&&&&&&&&&&
     /*   if (!languagePreferenceProperty) {
            throw new Error('[MultilingualBot]: Missing parameter. languagePreferenceProperty is required');
        }*/
//&&&&&&&&&&&&&&&&&&&&&
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.logger = logger;
        this.dialogState = this.conversationState.createProperty('DialogState');
       

        this.onMessage(async (context, next) => {
            this.logger.log('Running dialog with Message Activity.');
          /*  const IntroCard = CARDZ[0];
             context.sendActivity({
                text: '',
                attachments: [CardFactory.adaptiveCard(IntroCard)]
            });*/
            // Run the Dialog with the new message Activity.
            await this.dialog.run(context, this.dialogState);

           await next();
        });

        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, true);
            await this.userState.saveChanges(context, true);
            await next();
        });
    }
}

module.exports.DialogBot = DialogBot;


class DispatchBot extends ActivityHandler {
    /**
     * @param {any} logger object for logging events, defaults to console if none is provided
     */
    constructor(logger) {
        super();
        if (!logger) {
            logger = console;
            logger.log('[DispatchBot]: logger not passed in, defaulting to console');
        }

        const dispatchRecognizer = new LuisRecognizer({
            applicationId: process.env.LuisAppId,
            endpointKey: process.env.LuisAPIKey,
            endpoint: `https://${process.env.LuisAPIHostName}.api.cognitive.microsoft.com`
        }, {
                includeAllIntents: true,
                includeInstanceData: true
            }, true);

        const qnaMaker = new QnAMaker({
            knowledgeBaseId: process.env.QnAKnowledgebaseId,
            endpointKey: process.env.QnAAuthKey,
            host: process.env.QnAEndpointHostName
        });

        this.logger = logger;
        this.dispatchRecognizer = dispatchRecognizer;
        this.qnaMaker = qnaMaker;

        this.onMessage(async (context, next) => {
            this.logger.log('Processing Message Activity.');

            // First, we use the dispatch model to determine which cognitive service (LUIS or QnA) to use.
            const recognizerResult = await dispatchRecognizer.recognize(context);

            // Top intent tell us which cognitive service to use.
            const intent = LuisRecognizer.topIntent(recognizerResult);

            // Next, we call the dispatcher with the top intent.
            await this.dispatchToTopIntentAsync(context, intent, recognizerResult);

            await next();
        });

        /* this.onMembersAdded(async (context, next) => {
             const welcomeText = 'Type a greeting or a question about the weather to get started.';
             const membersAdded = context.activity.membersAdded;
 
             for (let member of membersAdded) {
                 if (member.id !== context.activity.recipient.id) {
                     await context.sendActivity(`tztztz (-___-) ${ member.name }. ${ welcomeText }`);
                 }
             }
 
             // By calling next() you ensure that the next BotHandler is run.
             await next();
         });*/
    }

    async dispatchToTopIntentAsync(context, intent, recognizerResult) {
        switch (intent) {
            case 'DoctorsOffice':
                await this.processDoctorsOffice(context, recognizerResult.luisResult);
                break;
            /* case 'l_Weather':
                 await this.processWeather(context, recognizerResult.luisResult);
                 break;*/
            case 'fragenbot1':
                await this.processFragenbot1(context);
                break;
            /* default:
                 this.logger.log(`: ${ intent }.`);
                 await context.sendActivity(`: ${ intent }.`);
                 break;*/
        }
    }

    async processDoctorsOffice(context, luisResult) {
        this.logger.log('processDoctorsOffice');

        // Retrieve LUIS result for Process Automation.
        const result = luisResult.connectedServiceResult;
        const intent = result.topScoringIntent.intent;

        //        await context.sendActivity(`DoctorsOffice top intent ${ intent }.`);
        //       await context.sendActivity(`DoctorsOffice intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);
        await context.sendActivity(`${intent}`);
        await context.sendActivity(`${luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n')}.`);

        if (luisResult.entities.length > 0) {
            //           await context.sendActivity(`DoctorsOffice entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
            await context.sendActivity(`${luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n')}.`);
        }
    }

    /*  async processWeather(context, luisResult) {
          this.logger.log('processWeather');
  
          // Retrieve LUIS results for Weather.
          const result = luisResult.connectedServiceResult;
          const topIntent = result.topScoringIntent.intent;
  
          await context.sendActivity(`ProcessWeather top intent ${ topIntent }.`);
          await context.sendActivity(`ProcessWeather intents detected:  ${ luisResult.intents.map((intentObj) => intentObj.intent).join('\n\n') }.`);
  
          if (luisResult.entities.length > 0) {
              await context.sendActivity(`ProcessWeather entities were found in the message: ${ luisResult.entities.map((entityObj) => entityObj.entity).join('\n\n') }.`);
          }
      }*/

    async processFragenbot1(context) {
        //       this.logger.log('processFragenbot1');
        this.logger.log('processFragenbot1');

        const results = await this.qnaMaker.getAnswers(context);

        if (results.length > 0) {
            await context.sendActivity(`${results[0].answer}`);
        } else {
            await context.sendActivity('Sorry, could not find an answer in the Q and A system.');
        }
    }
}

module.exports.DispatchBot = DispatchBot;
