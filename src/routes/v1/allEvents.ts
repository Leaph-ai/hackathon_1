import Edusign from '@_edusign/api';
import { Request, Response } from 'express';
import {isSet} from "lodash";
import app from "@app";
import {radioButtonsBlockSchema} from "@_edusign/api/validators/block.validator";


/**
 * Handles the home route for the application.
 *
 * This function creates a new instance of the `Edusign.Blocks` API to generate
 * a structured response containing a title and description for the app. The
 * response is then sent back to the client in JSON format.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 *
 * @returns A JSON response containing the title and description of the app.
 * 
 * @see https://developers.edusign.com/docs/action-documentation
 */
export default async function allEvents(req: Request, res: Response) {
  const blocksApi = new Edusign.Blocks();

  blocksApi.Button("createEventButton", "primary", "+ Créer un évènement", "https://complete-rare-octopus.ngrok-free.app/v1/createEvent", {
    "name": "myAction",
    "data": {
      "key1": "value1",
      "key2": "value2"
    }
  });

  blocksApi.Wrapper("wrapperId", [
    { label: "Tout les événements", value: "allevents" },
    { label: "Mes événements", value: "myevents" }
  ], "allevents", "https://complete-rare-octopus.ngrok-free.app/v1/myEvents", {
    name: "moduleSelected",
    data: {}
  });

  blocksApi.Divider('separation');

  const sqlite3 = require('sqlite3').verbose();

  const db = new sqlite3.Database('./.db/db-local.sqlite', (err: { message: any; }) => {
    if (err) {
      return console.error('Erreur lors de l’ouverture de la base de données :', err.message);
    }
    console.log('Connexion réussie à la base SQLite.');
  });

  console.log(req.body !== undefined)
  console.log(req.body)
  if (req.body !== undefined) {
    // @ts-ignore
    if (req.body["my-input"] !== undefined) {
      // @ts-ignore
      if (req.body["my-datepicker"] !== undefined) {
        // @ts-ignore
        if (req.body["my-textarea"] !== undefined) {
          // @ts-ignore
          if (req.body["hour-input"] !== undefined) {
            console.log("Headers reçus :", req.headers);
            db.run(
                `INSERT INTO events (event_name, event_date, event_duration, school_id, client_id) VALUES (?, ?, ?, ?, ?)`,
                [
                  req.body["my-input"],
                  req.body["my-datepicker"].substring(0, 10),
                  req.body["hour-input"],
                  req.headers["x-edusign-school-id"],
                  req.headers["x-edusign-client-id"]
                ]
            );
          }
        }
      }
    }
  }

  db.all("SELECT * FROM events", (err: { message: any; }, rows: any) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête :", err.message);
    } else {
      for (let i = 0; i < rows.length; i++ ) {

        let name = i.toString();

        blocksApi.Title("event-name" + name, rows[i]["event_name"]);
        blocksApi.Text("event-date" + name, rows[i]["event_date"] + "Durée : " + rows[i]["event_duration"])

        let buttonsList = [
            {
                  label: "Participer",
                  style: "primary",
                  action: {
                    name: "participateAction",
                    data: {}
                  },
                  url: ''
            }
            ];

        if (req.headers["x-edusign-client-id"] !== undefined && req.headers["x-edusign-client-id"] === rows[i]["client_id"]) {
          buttonsList.push({
            label: "Modifier",
            style: "secondary",
            action: {
              name: "modifyAction",
              data: {}
            },
            url: ''
          })
        }

        blocksApi.Buttons("exampleButtonsBlock" + name , buttonsList);

        blocksApi.Divider("divider" + name);
      }
    }
  });

  db.close();

  res.send(blocksApi.toJson());
}
