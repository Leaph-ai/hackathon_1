import Edusign from '@_edusign/api';
import { Request, Response } from 'express';
import db from "@db";
import {getParticipationTab, getParticipationString} from "@routes/v1/getParticipation";
import {el} from "@faker-js/faker";

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

  if (typeof global.STUDENTID === 'undefined') {
    global.STUDENTID = req.body["caller"]["userId"];
  } else {
    const studentId = global.STUDENTID;
  }

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

  if (req.body?.["my-input"] && req.body?.["my-datepicker"] && req.body?.["my-textarea"] && req.body?.["hour-input"]) {
    await db('events').insert({
      event_name: req.body["my-input"],
      event_date: req.body["my-datepicker"].substring(0, 10),
      event_duration: req.body["hour-input"],
      event_description: req.body["my-textarea"],
      school_id: req.schoolId,
      student_id: STUDENTID
    });
  }

  if (req.body?.["title-input"] && req.body?.["datepicker-input"] && req.body?.["textarea-input"] && req.body?.["id"] && req.body?.["hour-input"]) {
    await db('events').where('id', req.body?.["id"]).update({
      event_name: req.body["title-input"],
      event_date: req.body["datepicker-input"],
      event_description: req.body["textarea-input"],
      event_duration : req.body["hour-input"]
    });
  }

  if (req.body?.["action"]) {
    if (req.body?.["action"] !== "empty") {
      await db('events').where('id', req.body?.["action"]).delete();
    }
  }

  const events = await db('events').select();


  events.forEach((event: any) => {
    blocksApi.Title("event-name-" + event.id, event.event_name);
    blocksApi.Text("event-description-" + event.id, event.event_description || "/");
    blocksApi.Text("event-date-" + event.id, event.event_date + ", Durée : " + event.event_duration);

    let participationStatus: string = event.participation ? event.participation.split(',').toString() : "";

    let buttonsList = [
        {
          label: "Participer",
          style: "primary",
          action: {
            name: participationStatus || "empty",
            data: {}
          },
          url: 'https://complete-rare-octopus.ngrok-free.app/v1/allEvents'
        }
        ];


    if (global.STUDENTID === event.student_id) {
      buttonsList.push({
        label: "Modifier",
        style: "secondary",
        action: {
          name: event.id.toString(),
          data: {}
        },
        url: 'https://complete-rare-octopus.ngrok-free.app/v1/modifyEvents'
      },{
            label: "Supprimer",
            style: "danger",
            action: {
              name: event.id.toString(),
              data: {}
            },
            url: 'https://complete-rare-octopus.ngrok-free.app/v1/allEvents'
          }
          )
    }

    // @ts-ignore
    blocksApi.Buttons("exampleButtonsBlock" + event.id , buttonsList);

    blocksApi.Divider("divider" + event.id);
  })

  res.send(blocksApi.toJson());
}
