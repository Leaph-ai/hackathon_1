import Edusign from '@_edusign/api';
import { Request, Response } from 'express';

/**
 * Handles the creation of an event.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export default async function createEvent(req: Request, res: Response) {
    try {
        const blocksApi = new Edusign.Blocks();

        const { title, date, description } = req.body;

        blocksApi.Form(
            "createForm",
            [
                {
                    type: "input",
                    name: "my-input",
                    label: "Titre de l'événement",
                    placeholder: "Titre",
                    value: title || "",
                },
                {
                    type: "datepicker",
                    name: "my-datepicker",
                    label: "Date de l'événement",
                    value: date || new Date().toISOString(),
                },
                {
                    type: "textarea",
                    name: "my-textarea",
                    label: "Description de l'événement",
                    value: description || "",
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
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
