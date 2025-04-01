import db from "@db";
import { Knex } from 'knex';

/**
 * Handles the creation of an event.
 *
 * @param title
 */
export async function getParticipationTab(title: Knex.DbColumn<any> | null) {
    try {
        let participation = await db.select("participation").where("event_name", title)[Symbol.toStringTag];
        return participation.split(',');
    } catch (error) {
        console.error("Error getting participation:", error);
    }
}

export async function getParticipationString(participationTab: string | any[]) {
    try {
        let participation = ""
        for (let i = 0; i < participationTab.length; i++) {
            participation.concat(participationTab[i])
            if (i !== participationTab.length - 1) {
                participation.concat(",");
            }
        }
      console.log(participation)
    } catch (error) {
        console.error("Error getting participation:", error);
    }
}
