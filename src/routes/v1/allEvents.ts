import Edusign from '@_edusign/api';
import { Request, Response } from 'express';
import {isSet} from "lodash";


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

  console.log(req.body !== undefined)
  console.log(req.body)
  if (req.body !== undefined) {
    // @ts-ignore
    if (req.body["my-input"] !== undefined)
    {
      // @ts-ignore
      console.log(req.body["my-input"]);
    }
    if (req.body["my-datepicker"] !== undefined)
    {
      // @ts-ignore
      console.log(req.body["my-datepicker"]);
    }
    if (req.body["my-textarea"] !== undefined)
    {
      // @ts-ignore
      console.log(req.body["my-textarea"]);
    }
  }

  const sqlite3 = require('sqlite3').verbose();

  const db = new sqlite3.Database('./.db/db-local.sqlite', (err: { message: any; }) => {
    if (err) {
      return console.error('Erreur lors de l’ouverture de la base de données :', err.message);
    }
    console.log('Connexion réussie à la base SQLite.');
  });

// Requête pour récupérer toutes les lignes de la table "events"
  db.all("SELECT * FROM events", (err: { message: any; }, rows: any) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête :", err.message);
    } else {
      console.log("Liste des événements :", rows);
    }
  });

// Fermer la base de données après la requête
  db.close();

  //
  // for (let i = 0; i < ; ) {
  //
  // }

  res.send(blocksApi.toJson());
}
