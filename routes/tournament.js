// routes/newAndUpdates.js
const express = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware');
const tournamentController = require('../controllers/tournamentController');
const { route } = require('./auth');
const router = express.Router();


/* tournaments */
router.post('/create', authMiddleware, tournamentController.createTournament);
router.put('/updateTournament/:_id', tournamentController.updateTournaments)
router.delete('/deleteTournament/:_id', tournamentController.deleteTournament)
router.get('/:_id', tournamentController.tournamentByID);
router.get('/all/tournament', tournamentController.Alltournament);

/* participates */
router.post('/participate/:tournamentId/:userId', tournamentController.participate)
router.post('/unParticipate/:tournamentId/:userId', tournamentController.unParticipate)
router.get('/participates/:tournamentId', tournamentController.getParticipates)

module.exports = router;
