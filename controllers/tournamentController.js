const sendResponse = require("../utils/response");
const tournament  = require("../models/tournament.model");


/*Create Tournaments*/
exports.createTournament = async (req, res) => {
    try{
        let isExists = await tournament.findOne({ name: req.body.name });
        if (isExists) throw { message: "You have already registered" };
        
        let newTournament = await tournament.create({ ...req.body });
        return sendResponse(res, 201,  "Registered successfully", newTournament);        

    }catch (error) {
      console.error("Error creating business:", error);
      sendResponse(res, 500, "Failed to register", null, [error.message]);
    } 
};

/** update Tournaments */
exports.updateTournaments = async(req, res)=>{
    try {
        let _id = req.params;
        let isExists = await tournament.findOne({ _id , deleted: false});
        if (!isExists) throw { message: "Tournament has not added yet" };

        let tournaments =  await tournament.updateOne({_id }, {$set : req.body}, { new: true } );
        return sendResponse(res, 200, "tournament updated successfully", tournaments);        

    } catch (error) {
        console.error("Error updating tournaments:", error);
        sendResponse(res, 500, "Failed to update tournaments", null, [error.message]);
    }
};

/** delete tournament */
exports.deleteTournament = async (req, res) => {
    try {
        let _id = req.params;
        let tournaments = await tournament.findByIdAndUpdate( _id, { deleted: true }, { new: true } );
        if (!tournaments) {
            return sendResponse(res, 404, "tournaments not found");
          }
          return sendResponse(res, 200, "tournaments deleted successfully");
        } catch (error) {
          console.error("Error deleting tournaments:", error);
          sendResponse(res, 500, "Failed to delete tournaments", null, [error.message]);
        }
};

/** read tournament by Id */
exports.tournamentByID = async (req, res) => {
    try {
        let _id = req.params;
        let tournaments = await tournament.findOne({ _id, deleted: false });
        if (!tournaments) {
          return sendResponse(res, 404, "tournament not found");
        } else {
          return sendResponse(res, 200, "tournament  fetched successfully", tournaments);
        }
    }
    catch (error) {
        console.error("Error fetching tournament profile: ", error);
        sendResponse(res, 500, "Failed to fetch", null, [
            error.message,
        ]);
    }
};    

/* Get all tournaments*/
exports.Alltournament = async (req, res) => {
    try {
      
      let { offset, limit } = req.query;
        offset = Math.max(parseInt(offset) || 0, 0);
        limit = Math.max(parseInt(limit) || 10, 10);

      const { teamSize, status, entryFees, reward, location } = req.query;
      const filters = { teamSize, status, entryFees, reward, location };

    if (Object.keys(filters).length > 0) {
        const matchStage = {
            $match: { deleted: false }, 
          };
          for (const key in filters) {
          if (filters[key]) {
            matchStage.$match[key] = filters[key];
           }
          }      
          const filterdData = await tournament
          .aggregate([
              matchStage,
              {
                  $project: {
                      _id: 0,
                      name: 1,
                      description: 1,
                      reward: 1,
                      startDate: 1,
                      endDate: 1,
                      participants: 1,
                      status: 1,
                      teamSize: 1,
                      location: 1,
                      entryFees: 1,
                      deleted: 1,
                      updatedAt: 1,
                  },
              },
              {
                  $sort: {
                      updatedAt : -1
                  }
              },
              {$facet : {
                  tournament : [{$skip : offset}, {$limit : limit}],
                  totalCount : [{$count : 'count'}]
              }}
          ]).exec();
          return sendResponse(res, 200, "tournament filtered successfully", filterdData);
    } else {
        const findData = await tournament
        .aggregate([
            { $match: {deleted: false} },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    description: 1,
                    reward: 1,
                    startDate: 1,
                    endDate: 1,
                    participants: 1,
                    status: 1,
                    teamSize: 1,
                    location: 1,
                    entryFees: 1,
                    deleted: 1,
                    updatedAt: 1,
                },
            },
            {
                $sort: {
                    updatedAt : -1
                }
            },
            {$facet : {
                tournament : [{$skip : offset}, {$limit : limit}],
                totalCount : [{$count : 'count'}]
            }}
        ]).exec();
        return sendResponse(res, 200, "tournament fetched successfully", findData)
    }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      sendResponse(res, 500, "Failed to fetch tournaments", null, [error.message]);
    }
};

/*participate in Tournaments*/
/*
exports.participate = async (req, res) => {
    let { tournamentId, userId } = req.params;
    try {
      const existingTournament = await tournament.findById(tournamentId);
  
      if (!existingTournament) {
        return res.status(404).json({ message: 'Tournament not found' });
      }
  
      if (existingTournament.participants.includes(userId)) {
        return res.status(400).json({ message: 'You have already participated in this tournament' });
      }
  
      existingTournament.participants.push(userId);
      const updatedTournament = await existingTournament.save();
  
      res.json(updatedTournament);
    } catch (error) {
      console.error("Error in participating:", error);
      sendResponse(res, 500, "Failed to participate", null, [error.message]);
    }
};
*/

exports.participate = async (req, res) => {
    const { tournamentId, userId } = req.params;
    try {
      const tournaments = await tournament.findOne({
        _id: tournamentId,
        deleted: false,
      });

      if (!tournaments) {
        return sendResponse(res, 404, "Tournament not found or deleted");
      }

      tournaments.participants.addToSet(userId);
      const updatedTournament = await tournaments.save();

      return sendResponse(res, 200, "participated successfully", updatedTournament);        
    } catch (error) {
      console.error("Error in participating:", error);
      sendResponse(res, 500, "Failed to Participate", null, [error.message]);
    }
};
  

/*Un participate from Tournaments*/
  exports.unParticipate = async (req, res) => {
    let { tournamentId, userId } = req.params;
    try {
      const tournaments = await tournament.findByIdAndUpdate(
        tournamentId,
        { $pull: { participants: userId } },
        { new: true }
      );
  
      if (!tournaments) {
        return sendResponse(res, 404, "Tournament not found");
      }

      return sendResponse(res, 200, "Un participated successfully", tournaments);        
    } catch (error) {
        console.error("Error in un participating:", error);
        sendResponse(res, 500, "Failed to Un Participate", null, [error.message]);
    }
};

exports.getParticipates = async (req, res) => {
    const { tournamentId } = req.params;
    let { offset, limit } = req.query;
        offset = Math.max(parseInt(offset) || 0, 0);
        limit = Math.max(parseInt(limit) || 10, 10);

    try {
      const tournaments = await tournament
        .findById(tournamentId).populate('participants', 'userName'); 
  
      if (!tournaments) {
        return sendResponse(res, 404, "Tournament not found");
      }
  
      let participants = tournaments.participants.map(user => user.userName);
      let totalCount = participants.length;
    
      const slicedParticipants = participants.slice(offset, offset + limit);

      return sendResponse(res, 200, "Fetched successfully", { participants: slicedParticipants, totalCount })     
    } catch (error) {
        console.error("Error fetching details:", error);
        sendResponse(res, 500, "Failed to fetch participate details", null, [error.message,]);
    }
};
  