import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { OK } from '../utils/httpStatusCodes';
import { leaderboardMock, teamsMock } from './mocks';
import Match from '../database/models/MatchModel';
import Team from '../database/models/TeamModel';
import { Model } from 'sequelize';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for route /leaderboard', function () {
  afterEach(() => sinon.restore());

  describe('getHomeLeaderboard method', function () {
    it('should be able to get home leaderboard', async function () {
      sinon.stub(Team, 'findAll').resolves(teamsMock.teamList);
      sinon.stub(Match, 'findAll').resolves(leaderboardMock.matchList);

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.body).to.deep.equal(leaderboardMock.homeLeaderboard);
      expect(response.status).to.equal(OK);
    });
  });

  describe('getAwayLeaderboard method', function () {
    it('should be able to get away leaderboard', async function () {
      sinon.stub(Team, 'findAll').resolves(teamsMock.teamList);
      sinon.stub(Match, 'findAll').resolves(leaderboardMock.matchList);

      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.body).to.deep.equal(leaderboardMock.awayLeaderboard);
      expect(response.status).to.equal(OK);
    });
  });

  describe('getLeaderboard method', function () {
    it('should be able to get leaderboard', async function () {
      sinon.stub(Team, 'findAll').resolves(teamsMock.teamList);
      sinon.stub(Match, 'findAll').resolves(leaderboardMock.matchList);

      const response = await chai.request(app).get('/leaderboard/');
      expect(response.body).to.deep.equal(leaderboardMock.leaderboard);
      expect(response.status).to.equal(OK);
    });
  });
});
