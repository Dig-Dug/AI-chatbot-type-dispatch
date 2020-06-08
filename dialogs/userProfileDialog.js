// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

var rp = require('request-promise');

var options = {
    method: 'POST',
    uri: 'http://localhost:8080/id',
    body: {
        "fieldCount": 0,
    "affectedRows": 1,
    "insertId": 61,
    "serverStatus": 2,
    "warningCount": 0,
    "message": "",
    "protocol41": true,
    "changedRows": 0
    },
    json: true,
    headers: {
        'content-type': 'application/json'  //you can append other headers here 
    }
};


const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
//var session = require('express-session');
// var path = require('path');
var app = express();

let cors = require('cors');
app.use(cors());

//var http = require('htpp');

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'arztpraxis',
    dateStrings: 'date',
    timezone: 'UTC',
    multipleStatements: true
});

const {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    ConfirmPrompt,
    DialogSet,
    DialogTurnStatus,
    NumberPrompt,
    DateTimePrompt,
    TextPrompt,
    WaterfallDialog
} = require('botbuilder-dialogs');
const { UserProfile } = require('../userProfile');

const CHOICE_PROMPT = 'CHOICE_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const CONFIRM_PROMPT1 = 'CONFIRM_PROMPT1';
const CONFIRM_PROMPT2 = 'CONFIRM_PROMPT2';
const CONFIRM_PROMPT3 = 'CONFIRM_PROMPT3';
const NAME_PROMPT = 'NAME_PROMPT';
const PASS_PROMPT = 'PASS_PROMPT';
const DATE_PROMPT = 'DATE_PROMPT';



const CONFIRM_PROMPT4 = 'CONFIRM_PROMPT4';
const USER_PROFILE = 'USER_PROFILE';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';

var Recognizers = require('@microsoft/recognizers-text-suite');




//await bot.run(turnContext);

class UserProfileDialog extends ComponentDialog {
    constructor(userState, logger) {
        super('userProfileDialog');

        this.userProfile = userState.createProperty(USER_PROFILE);

        this.logger = logger;

        this.addDialog(new TextPrompt(NAME_PROMPT));
        this.addDialog(new TextPrompt(PASS_PROMPT));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT1));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));

        this.addDialog(new TextPrompt(DATE_PROMPT, this.datePromptValidator));
        //////////////////////////////
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT2));

       this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT3));

        

        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT4));

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.transportStep.bind(this),
            this.nameStep.bind(this),
            this.nameConfirmStep.bind(this),
            this.passwordStep.bind(this),
            this.passwordConfirmStep.bind(this),
    
            this.dateStep.bind(this),
            this.confirmStep1.bind(this),
            ////////////////////////////
            this.summaryStep.bind(this),

           
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async transportStep(step) {
        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        // Running a prompt here means the next WaterfallStep will be run when the users response is received.
        return await step.prompt(CHOICE_PROMPT, {
            prompt: 'mit welchem Arzt brauchen Sie einen termin?',
            choices: ChoiceFactory.toChoices(['Dr. Albini', 'Frau Weiß', 'Dr Castaneda'])
        });
    }

    async nameStep(step) {
        step.values.transport = step.result.value;
        return await step.prompt(NAME_PROMPT, `Bitte Ihre Name geben`);
    }

    async nameConfirmStep(step) {
        step.values.name = step.result;

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(`Danke ${step.result}.`);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT, `Bitte bestätigen Sie, dass Sie ${step.result} heißen`, ['ja', 'nein']);
    }
    async passwordStep(step) {
        step.values.password = step.result.value;
        return await step.prompt(PASS_PROMPT, `Bitte e-mail geben`);
    }
    async passwordConfirmStep(step) {
        step.values.password = step.result;

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(`Ihre e-mail lautet ${step.result}.`);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog; here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT1, `ist das richtig? ${step.result}`, ['ja', 'nein']);
    }

    async dateStep(step) {
        if (step.result) {

            const promptOptions1 = { prompt: 'Wann möchten Sie einen Termin? z.b. "12.12.2019"' };
            return await step.prompt(DATE_PROMPT, promptOptions1);
        } else {
            // If we couldn't interpret their input, ask them for it again.
            // Don't update the conversation flag, so that we repeat this step.
            await turnContext.sendActivity(result.message || "I'm sorry, I didn't understand that.");
            /*  break;
             return await step.next(-1);*/
        }
    }
    async confirmStep1(step) {
        step.values.date = step.result;

        const msg = step.values.date === -1 ? 'Keine Datum eingegeben' : `Ich habe Ihre Termin den ${step.values.date}.`;

        // We can send messages to the user at any point in the WaterfallStep.
        await step.context.sendActivity(msg);

        // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is a Prompt Dialog.
        return await step.prompt(CONFIRM_PROMPT4, { prompt: 'ist das richtig (°__°)' });
    }



    async summaryStep(step) {
        if (step.result) {
            // Get the current profile object from user state.
            const userProfile = await this.userProfile.get(step.context, new UserProfile());

            userProfile.transport = step.values.transport;
            userProfile.name = step.values.name;
            //  userProfile.age = step.values.age;
            userProfile.password = step.values.password;
            userProfile.date = step.values.date;
            let msg = `Sie möchten einen Termin mit dr ${userProfile.transport} , Ihre Name ist ${userProfile.name}.`;

           // let dd = DispatchBot;

            if (userProfile.date !== -1) {
                msg += `Und den Termin den ${userProfile.date}.`;
               // dd == UserProfile;
            }
             
            await step.context.sendActivity(msg);
            let msg1 = `"${userProfile.date}"`;

            if (msg1) {
                let z = JSON.stringify(userProfile.name);
                let zz = JSON.stringify(userProfile.password);
                let x = JSON.stringify(userProfile.date);
                let xx = JSON.stringify(userProfile.transport);
                var name = JSON.parse(z);
                var email = JSON.parse(zz);
                var age = JSON.parse(x);
                var doctor = JSON.parse(xx);
                var password = JSON.parse(zz);

                

                console.log(z)
                console.log(zz)
                console.log(age)
                console.log(doctor)

                var urlencoded = bodyparser.urlencoded({ extended: false });
                app.post('/id', urlencoded, (req, res) => {
                    app.use(express.json());
                    app.use(express.urlencoded({ extended: true }));
                    mysqlConnection.query("INSERT INTO users(name, email, doctor, datum) VALUES('" + userProfile.name + "','" + userProfile.password + "','" + userProfile.transport + "','" + userProfile.date + "')", function (err, result, rows) {
                        if (err) throw err;
                        console.log("Yeah! record inserted");
                        console.log(name);
                        // res.send(name);
                        res.send(result);
                    });
                });
                const port = process.env.PORT || 8080;
                app.listen(port, () => console.log(`Listening on port ${port}..`));
            }

            var urlencoded = bodyparser.urlencoded({ extended: false });

            await rp(options)
                .then(function (body) {
                    console.log(body)
                })
                .catch(function (err) {
                    console.log(err)
                });
        
            app.post('/id', urlencoded, (req, res) => {
                app.use(express.json());
                app.use(express.urlencoded({ extended: true }));
               mysqlConnection.query("INSERT INTO users(name, email, doctor, datum) VALUES('" + userProfile.name + "','" + userProfile.password + "','" + userProfile.transport + "','" + userProfile.date + "')", function (err, result, rows) {
                    if (err) throw err;
                    console.log("Yeah! record inserted");
                    console.log(name);
                    // res.send(name);
                    res.send(result);
                });
            });

          app.get('/', (req, res) => {
                let name = msg;
                mysqlConnection.query('SELECT * FROM users', [name], (err, rows, fields) => {
                    if (!err)
                        res.send(rows);
                    else
                        console.log(err);
                })
          });

          /*  function logSubmit(event) {
                log.textContent = `Form Submitted! Time stamp: ${event.timeStamp}`;
                event.preventDefault();
            }

            const form = app.getElementById('form');
            form.addEventListener('/id', logSubmit); */




          /*  const port = process.env.PORT || 8080;
            app.listen(port, () => console.log(`Listening on port ${port}..`));*/

        } else {
            await step.context.sendActivity('Thanks. Your profile will not be kept. Push enter to return Menu');
        }
  return await step.prompt(CONFIRM_PROMPT3, `ist das richtig? ${step.result}`, ['ja', 'nein']);
   
    // WaterfallStep always finishes with the end of the Waterfall or with another dialog, here it is the end.
        if (step.result == 'ja') {
            return await step.context.sendActivity(`wir werden zu diese Addresse bald melden ${userProfile.password}.`);
        }
    return await step.endDialog();
    }

   

    async datePromptValidator(promptContext) {
        // This condition is our validation rule. You can also change the value at this point.
        // return promptContext.recognized.succeeded && promptContext.recognized.value > 0 && promptContext.recognized.value < 150;

        try {
            const results = Recognizers.recognizeDateTime(input, Recognizers.Culture.English);
            const now = new Date();
            const earliest = now.getTime() + (60 * 60 * 1000);
            let output;
            results.forEach(result => {
                // result.resolution is a dictionary, where the "values" entry contains the processed input.
                result.resolution['values'].forEach(resolution => {
                    // The processed input contains a "value" entry if it is a date-time value, or "start" and
                    // "end" entries if it is a date-time range.
                    const datevalue = resolution['value'] || resolution['start'];
                    // If only time is given, assume it's for today.
                    const datetime = resolution['type'] === 'time'
                        ? new Date(`${now.toLocaleDateString()} ${datevalue}`)
                        : new Date(datevalue);
                    if (datetime && earliest < datetime.getTime()) {
                        output = { success: true, date: datetime.toLocaleDateString() };
                        // promptContext == output;
                        promptContext.recognized.succeeded && promptContext.recognized.value == output;
                        return;
                    }
                });
            });
            return output || { success: false, message: "I'm sorry, please enter a date at least an hour out." };
        } catch (error) {
            return {
                success: false,
                message: "I'm sorry, I could not interpret that as an appropriate date. Please enter a date at least an hour out."
            };
        }
    }
}




    // console.log(evt.currentTarget.responseText);


module.exports.UserProfileDialog = UserProfileDialog;


