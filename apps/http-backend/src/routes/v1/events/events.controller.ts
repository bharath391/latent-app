import {Request,Response} from "express";
import {client} from "@repo/db/client";

class EventController{
    async createEvent(req:Request,res:Response){
        try{
            const {adminId,name,description,banner} = req.body;
            const missingFields = [];
            if (!adminId) missingFields.push("adminId");
            if (!name) missingFields.push("name");
            if (!description) missingFields.push("description");
            if (!banner) missingFields.push("banner");

            if (missingFields.length > 0) {
                res.status(400).json({
                    error: "Missing required fields",
                    missing: missingFields,
                });
                return;
            };
            //find the admin, add this to created events 
            const event = await client.event.create({
                data:{
                    adminId:adminId,
                    name:name,
                    description:description,
                    banner:banner,
                    lastUpdateBy:adminId
                    //bookings ? 
                }
            });
            res.status(200).json({msg:"Event created successfully",event:event});
            return;

        }catch(e){
            console.log("Error in create event controller","error------->",e);
            res.status(500).json({msg:"Interval server error"});
        }
    };
    async updateEvent(req: Request, res: Response) {
        try {
            const { adminId, eventId, name, description, banner } = req.body;

            const missingFields = [];
            if (!eventId) missingFields.push("eventId");
            if (!adminId) missingFields.push("adminId");
            if (!name) missingFields.push("name");
            if (!description) missingFields.push("description");
            if (!banner) missingFields.push("banner");

            if (missingFields.length > 0) {
                return res.status(400).json({
                    error: "Missing required fields",
                    missing: missingFields,
                });
            }

            const existingEvent = await client.event.findUnique({
                where: { id: eventId },
            });

            if (!existingEvent) {
                return res.status(404).json({ msg: "Event not found. Cannot update." });
            }

            // Setting 'lastUpdateBy' automatically handles the relation to the Admin model.
            const updatedEvent = await client.event.update({
                where: {
                    id: eventId,
                },
                data: {
                    name,           
                    description,
                    banner,
                    lastUpdateBy: adminId,
                },
            });

            res.status(200).json({ msg: "Event updated successfully", event: updatedEvent });

        } catch (e) {
            console.error("Error in updateEvent controller:", e);
            res.status(500).json({ msg: "Internal server error" });
        }
    };
    async deleteEvent(req:Request,res:Response){
        try{
            const {adminId,eventId} = req.body;

            if(!eventId || !adminId){
                res.status(404).json({msg:"Missing fields"});
                return;
            }
            const e = await client.event.findFirst({
                where:{
                    id:eventId
                }
            });
            if (!e){
                res.status(404).json({msg:"Event not found"});
                return;
            }
            //check weather admin is the creator of this event
            if (e.adminId != adminId){
                res.status(401).json({msg:"You are not the admin of this event"});
                return;
            }
            const event = await client.event.delete({
                where:{
                    id:eventId
                }
            });
            res.status(200).json({msg:"event deleted successfully"});
            return;
            
        }catch(e){
            console.log("Error in delete event controller","error------->",e);
            res.status(500).json({msg:"Interval server error"});
        }

    };
    async getEvent(req:Request,res:Response){
        try{
            const {eventId} = req.body;
            if(!eventId){
                res.status(400).json({msg:"Event Id missing"});
                return;
            }
            const event = await client.event.findFirst({
                where:{
                    id:eventId
                }
            });
            if(!event){
                res.status(404).json({msg:"Event not found"});
                return;
            }
            res.status(200).json({event:event});
            return;

        }catch(e){
            console.log("Error in getEvent event controller","error------->",e);
            res.status(500).json({msg:"Interval server error"});
        }

    };
    async getAllEvents(req:Request,res:Response){
        //what all events ? 
        //and any specific events possible ?
        //TODO:filters , get events based on admin or location or  some other filters
        try{
            //default values
            var page = 0;
            var count = 10;
            //if values specified frontend 
            if (!req.body.page){
                page = req.body.page;
            }
            if (!req.body.count){
                count = req.body.count;
            }
            //rn i will return all the available events
            const events = await client.event.findMany({
                skip:page*count,
                take:count //default take 10 only
            });
        }catch(e){
            console.log("Error in getAllEvents event controller","error------->",e);
            res.status(500).json({msg:"Interval server error"});
        }
    };
}

const eventController = new EventController();
export default eventController;