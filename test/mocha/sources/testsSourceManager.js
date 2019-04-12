const assert = require('assert');
const SourceManager = require('../../../src/js/sources/sourceManager');
const logManager = require('../logManager');

describe('Test de la classe SourceManager', function() {

  before(function() {
    // runs before all tests in this block
    logManager.manageLogs();
  });

  let sourceManager = new SourceManager();
  let sourcesIds = new Array();
  let sourcesDescriptions = {};

  let description = {
    "id": "corse-car-fastest",
    "type": "osrm",
    "storage": {
      "file": "/home/docker/data/corse-latest.osrm"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest",
      "compute": {
        "storage": {
          "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles/car.lua"
        }
      }
    }
  };

  let wrongDuplicateDescription = {
    "id": "corse-car-fastest",
    "type": "osrm",
    "storage": {
      "file": "/home/docker/data/corse-latest-2.osrm"
    },
    "cost": {
      "profile": "car",
      "optimization": "fastest",
      "compute": {
        "storage": {
          "file": "/home/docker/osrm/osrm-backend/osrm-backend-5.20.0/profiles/car.lua"
        }
      }
    }
  };

  sourcesIds.push(description.id);
  sourcesDescriptions[description.id] = description;

  describe('Test du constructeur et des getters/setters', function() {

    it('Get SourceManager listOfSourceIds', function() {
      assert.deepEqual(sourceManager.listOfSourceIds, new Array());
    });

    it('Get SourceManager sourceDescriptions', function() {
      assert.deepEqual(sourceManager.sourceDescriptions, {});
    });

    it('Set SourceManager listOfSourceIds', function() {
      sourceManager.listOfSourceIds = sourcesIds;
      assert.deepEqual(sourceManager.listOfSourceIds, sourcesIds);
    });

    it('Set SourceManager sourceDescriptions', function() {
      sourceManager.sourceDescriptions = sourcesDescriptions;
      assert.deepEqual(sourceManager.sourceDescriptions, sourcesDescriptions);
    });

  });

  describe('Test de la fonction checkSource()', function() {

    it('checkSource() avec une bonne description', function() {
      assert.equal(sourceManager.checkSource(description), true);
    });

    it('checkSource() avec un mauvais id', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

    it('checkSource() avec un mauvais type', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-2";
      wrongDescription.type = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

  });

  describe('Test de la fonction checkSourceOsrm()', function() {

    it('checkSourceOsrm() avec une bonne description', function() {
      assert.equal(sourceManager.checkSourceOsrm(description), true);
    });

    it('checkSourceOsrm() avec un mauvais cost', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-3";
      wrongDescription.cost = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.profile', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-4";
      wrongDescription.cost.profile = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.optimization', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-5";
      wrongDescription.cost.optimization = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

    it('checkSourceOsrm() avec un mauvais cost.compute', function() {
      let wrongDescription = JSON.parse(JSON.stringify(description));
      wrongDescription.id = "test-6";
      wrongDescription.cost.compute = "";
      assert.equal(sourceManager.checkSource(wrongDescription), false);
    });

  });

  describe('Test de la fonction checkDuplicationSource()', function() {

    it('checkDuplicationSource() avec une description identique', function() {
      assert.equal(sourceManager.checkDuplicationSource(description), true);
    });

    it('checkDuplicationSource() avec une description ayant le même id mais différente', function() {
      assert.equal(sourceManager.checkDuplicationSource(wrongDuplicateDescription), false);
    });

  });

  describe('Test de la fonction createSource()', function() {

    it('createSource() avec une description correcte', function() {
      let source = sourceManager.createSource(description);
      assert.equal(source.type, "osrm");
    });

  });

  describe('Test de la fonction connectSource()', function() {

    it('connectSource() avec une description correcte', async function() {
      const source = sourceManager.createSource(description);
      const sourceConnected= await sourceManager.connectSource(source);
      assert.equal(sourceConnected, true);
    });

  });

});
