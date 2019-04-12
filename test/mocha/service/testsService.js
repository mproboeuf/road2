const assert = require('assert');
const Service = require('../../../src/js/service/service');
const RouteRequest = require('../../../src/js/requests/routeRequest');
const logManager = require('../logManager');
const path = require('path');
const fs = require('fs');

describe('Test de la classe Service', function() {

  let service = new Service();
  let httpConf;
  let configuration;

  before(function() {

    // runs before all tests in this block
    logManager.manageLogs();

    // Chargement de la configuration pour les tests
    let file = path.resolve(__dirname,'../config/road2.json');
    configuration = JSON.parse(fs.readFileSync(file));

    // Chargement de la configuration pour les requêtes http
    logsConf = logManager.getLogsConf();
    service.logConfiguration = logsConf;

  });

  describe('Test de checkAndSaveGlobalConfiguration()', function() {

    it('checkAndSaveGlobalConfiguration() return true avec une configuration correcte', function() {
      assert.equal(service.checkAndSaveGlobalConfiguration(configuration), true);
    });

  });

  describe('Test de loadResources()', function() {

    it('loadResources() return true avec une configuration correcte', function() {
      assert.equal(service.loadResources(), true);
    });

  });

  describe('Test de loadSources()', function() {

    it('loadSources() return true avec une configuration correcte', async function() {
      const sourcesLoaded = await service.loadSources();
      assert.equal(sourcesLoaded, true);
    });

  });

  describe('Test de createServer() et stopServer()', function() {

    it('createServer() return true avec une configuration correcte', function() {
      assert.equal(service.createServer("../apis/", ""), true);
    });

    after(function(done) {
      service.stopServer(done);
    });

  });

  describe('Test de computeRequest()', function() {

    before(function() {
      service.createServer("../apis/", "");
    });

    it('computeRequest() avec une requete correcte', async function() {
      const request = new RouteRequest("corse-osm", {lon: 8.732901, lat: 41.928821}, {lon: 8.732901, lat: 41.953932}, "car", "fastest");
      const response = await service.computeRequest(request);
      assert.equal(response.resource, "corse-osm");
    });

    after(function(done) {
      service.stopServer(done);
    });

  });

});
