import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { OK } from '../utils/httpStatusCodes';
import { leaderboardMock, matchesMock, teamsMock } from './mocks';
import { Model } from 'sequelize';
import Match from '../database/models/MatchModel';
import Team from '../database/models/TeamModel';

chai.use(chaiHttp);
const { expect } = chai;

describe('Integration tests for route /leaderboard/home', function () {
  afterEach(() => sinon.restore());

  describe('findAllHome method', function () {
    it('should be able to find all home leaderboard', async function () {
      const findAllMatchStub = sinon.stub(Match, 'findAll');
      const findAllTeamStub = sinon.stub(Team, 'findAll');

      findAllTeamStub.resolves(teamsMock.teamList)
      
      teamsMock.teamList.forEach((_team, index) => {
        findAllMatchStub
          .onCall(index)
          .resolves(leaderboardMock.homeMatchList[index])
      })

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.body).to.deep.equal(leaderboardMock.homeLeaderboard);
      expect(response.status).to.equal(OK);
    });
  });
});
