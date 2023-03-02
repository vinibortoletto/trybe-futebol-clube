import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { expect } = chai;

import { app } from '../app';
import { Model } from 'sequelize';
import { matchesMock, usersMock } from './mocks';
import { CREATED, OK } from '../utils/httpStatusCodes';

describe('Integration tests for route /matches', function () {
  afterEach(() => sinon.restore());

  describe('findAll method', function () {
    it('should find all matches', async function () {
      sinon.stub(Model, 'findAll').resolves(matchesMock.matchList);
      const response = await chai.request(app).get('/matches').send();
      expect(response.body).to.deep.equal(matchesMock.matchList);
      expect(response.status).to.equal(OK);
    });
  });

  describe('finish method', function () {
    it('should be able to finish a match', async function () {
      sinon.stub(Model, 'update').resolves([1]);
      const response = await chai
        .request(app)
        .patch('/matches/1/finish')
        .set('Authorization', usersMock.validToken);

      expect(response.body).to.deep.equal({ message: 'Finished' });
      expect(response.status).to.equal(OK);
    });
  });

  describe('update method', function () {
    it('should be able to update a match in progress', async function () {
      sinon.stub(Model, 'update').resolves([1]);

      const response = await chai
        .request(app)
        .patch('/matches/1')
        .send(matchesMock.score)
        .set('Authorization', usersMock.validToken);

      expect(response.body).to.deep.equal({ message: 'Updated' });
      expect(response.status).to.equal(OK);
    });
  });

  describe('create method', function () {
    it.only('should be able to create a new match', async function () {
      sinon.stub(Model, 'create').resolves(matchesMock.matchResponse);

      const response = await chai
        .request(app)
        .post('/matches')
        .send(matchesMock.matchBody)
        .set('Authorization', usersMock.validToken);

      expect(response.body).to.deep.equal(matchesMock.matchResponse);
      expect(response.status).to.equal(CREATED);
    });
  });
});
