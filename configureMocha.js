const chai = require('chai');
const sinonChai = require('sinon-chai');
const chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);