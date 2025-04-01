import Edusign from '@_edusign/api';
import { Request, Response } from 'express';
import db from "@db";

/**
 * Handles the creation of an event.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export default async function modifyEvents(req: Request, res: Response) {
    try {
        const blocksApi = new Edusign.Blocks();

        const events = await db('events').select().where('id', req.body["action"]);

        const dbTitle = events[0]["event_name"];
        const dbDate = events[0]["event_date"];
        const dbDescription = events[0]["event_description"];

        blocksApi.Form(
            "modifyForm",
            [
                {
                    type: "input",
                    label:"id",
                    name:"id",
                    value: req.body["action"],
                    hidden: true,
                },
                {
                    type: "input",
                    name: "title-input",
                    label: "Titre de l'événement",
                    placeholder: "Titre",
                    value: dbTitle,
                },
                {
                    type: "datepicker",
                    name: "datepicker-input",
                    label: "Date de l'événement",
                    value: dbDate,
                },
                {
                    type: "textarea",
                    name: "textarea-input",
                    label: "Description de l'événement",
                    value: dbDescription || "",
                },
            ],

            {
                name: "submit",
                label: "Submit",
                style: "secondary",
            },
            "https://complete-rare-octopus.ngrok-free.app/v1/allEvents"
        );

        res.json(blocksApi.toJson());

        }

        catch (error) {
            console.error("Error creating event:", error);
            res.status(500).json({ error: "Internal server error" });
        }

    }