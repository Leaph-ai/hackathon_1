import Edusign from '@_edusign/api';
import { Request, Response } from 'express';
import db from "@db";

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
export default async function myEvents(req: Request, res: Response) {
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
  ], "myevents", "https://complete-rare-octopus.ngrok-free.app/v1/allEvents", {
    name: "moduleSelected",
    data: {}
  });

  blocksApi.Divider('separation');


  const events = await db('events').select().where('student_id', STUDENTID);

  let buttonsList = [];

  events.forEach(event => {
    blocksApi.Title("event-name-" + event.id, event.event_name);
    blocksApi.Text("event-date-" + event.id, event.event_date + " Durée : " + event.event_duration)

    buttonsList.push({
      label: "Modifier",
      style: "secondary",
      action: {
        name: event.id.toString(),
        data: {}
      },
      url: 'https://complete-rare-octopus.ngrok-free.app/v1/modifyEvents'
    })

    // @ts-ignore
    blocksApi.Buttons("exampleButtonsBlock" + event.id , buttonsList);

    blocksApi.Divider("divider" + event.id);


    res.send(blocksApi.toJson());
  });
}