"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scimPatch_1 = require("../src/scimPatch");
const chai_1 = require("chai");
describe('SCIM PATCH', () => {
    let scimUser;
    beforeEach(done => {
        scimUser = JSON.parse(`{
      "schemas": [
        "urn:ietf:params:scim:schemas:core:2.0:User"
      ],
      "id": "tea_4",
      "userName": "spiderman",
      "name": {
        "familyName": "Parker",
        "givenName": "Peter"
      },
      "active": true,
      "emails": [
        {
          "value": "spiderman@superheroes.com",
          "primary": true
        }
      ],
      "roles": [],
      "meta": {
        "resourceType": "User",
        "created": "2019-11-20T09:25:30.208Z",
        "lastModified": "2019-11-20T09:25:30.208Z",
        "location": "**REQUIRED**/Users/tea_4"
      },
      "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department": "value"
    }`);
        return done();
    });
    describe('replace', () => {
        it('REPLACE: first level property with path', done => {
            const expected = false;
            const patch = { op: 'replace', value: expected, path: 'active' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.active).to.be.eq(expected);
            return done();
        });
        it('REPLACE: first level property without path', done => {
            const expected = false;
            const patch = { op: 'replace', value: { active: expected } };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.active).to.be.eq(expected);
            return done();
        });
        it('REPLACE: 2 level property with path', done => {
            const expected = 'toto';
            const patch = { op: 'replace', value: expected, path: 'name.familyName' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.familyName).to.be.eq(expected);
            return done();
        });
        it('REPLACE: 2 level property without complete path', done => {
            const expected = 'toto';
            const patch = { op: 'replace', value: { familyName: expected }, path: 'name' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.familyName).to.be.eq(expected);
            return done();
        });
        it('REPLACE: multiple at once with path', done => {
            const expectedFamilyName = 'toto';
            const expectedGivenName = 'titi';
            const expectedActive = false;
            const patch1 = {
                op: 'replace', value: {
                    givenName: expectedGivenName,
                    familyName: expectedFamilyName
                }, path: 'name'
            };
            const patch2 = { op: 'replace', value: { active: expectedActive } };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1, patch2]);
            chai_1.expect(afterPatch.name.familyName).to.be.eq(expectedFamilyName);
            chai_1.expect(afterPatch.name.givenName).to.be.eq(expectedGivenName);
            chai_1.expect(afterPatch.active).to.be.eq(expectedActive);
            return done();
        });
        it('REPLACE: multiple at once with exact path', done => {
            const expectedFamilyName = 'toto';
            const expectedGivenName = 'titi';
            const expectedActive = false;
            const patch1 = {
                op: 'replace',
                value: expectedGivenName,
                path: 'name.givenName'
            };
            const patch2 = { op: 'replace', value: { active: expectedActive } };
            const patch3 = {
                op: 'replace',
                value: expectedFamilyName,
                path: 'name.familyName'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1, patch2, patch3]);
            chai_1.expect(afterPatch.name.familyName).to.be.eq(expectedFamilyName);
            chai_1.expect(afterPatch.name.givenName).to.be.eq(expectedGivenName);
            chai_1.expect(afterPatch.active).to.be.eq(expectedActive);
            return done();
        });
        it('REPLACE: primary email object', done => {
            const expected = 'toto@toto.com';
            const patch1 = {
                op: 'replace',
                value: { value: expected, primary: true },
                path: 'emails[primary eq true]'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.emails[0].value).to.be.eq(expected);
            chai_1.expect(afterPatch.emails[0].primary).to.be.eq(true);
            return done();
        });
        it('REPLACE: nested object do not exists', done => {
            var _a;
            scimUser.surName = [{ value: 'toto', primary: true }];
            const expected = 'toto@toto.com';
            const patch1 = {
                op: 'replace',
                value: { value: expected, primary: false },
                path: 'surName[primary eq false]'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect((_a = afterPatch.surName) === null || _a === void 0 ? void 0 : _a.length).to.be.eq(2);
            return done();
        });
        it('REPLACE: primary email value', done => {
            const expected = 'toto@toto.com';
            const patch1 = {
                op: 'replace',
                value: expected,
                path: 'emails[primary eq true].value'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.emails[0].value).to.be.eq(expected);
            chai_1.expect(afterPatch.emails[0].primary).to.be.eq(true);
            return done();
        });
        it('REPLACE: nested array element', done => {
            scimUser.name.nestedArray = [{ primary: true, value: 'value1' }];
            const expected = 'value2';
            const patch1 = {
                op: 'replace', value: {
                    value: expected,
                    primary: true
                }, path: 'name.nestedArray[primary eq true]'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.name.nestedArray && afterPatch.name.nestedArray[0].value).to.be.eq(expected);
            chai_1.expect(afterPatch.name.nestedArray && afterPatch.name.nestedArray[0].primary).to.be.eq(true);
            return done();
        });
        it('REPLACE: replace a non existent element', done => {
            const expected = true;
            const patch = { op: 'replace', value: expected, path: 'unknown.toto' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.unknown.toto).to.be.eq(expected);
            return done();
        });
        it('REPLACE: add a non object value to an object key', done => {
            const expected = 'BATMAN';
            const patch = { op: 'replace', path: 'name', value: expected };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name).to.be.eq(expected);
            return done();
        });
        it('REPLACE: should not modify anything if element not found', done => {
            scimUser.name.nestedArray = [{ primary: true, value: 'value1' }];
            const patch1 = {
                op: 'replace', value: {
                    newProperty1: 'toto'
                }, path: 'name.nestedArray[toto eq true]'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.name.nestedArray).to.be.eq(scimUser.name.nestedArray);
            return done();
        });
        it('REPLACE: XXX', done => {
            const patch1 = { op: 'remove', path: 'emails[primary eq true].value' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.emails[0].value).not.to.exist;
            chai_1.expect(afterPatch.emails[0].primary).to.eq(true);
            return done();
        });
        it('REPLACE: with capital first letter for operation', done => {
            const expected = false;
            const patch = { op: 'Replace', value: { active: expected } };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.active).to.be.eq(expected);
            return done();
        });
        it('REPLACE: with version number in path', done => {
            const expected = 'newValue';
            const path = 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department';
            const patch = {
                op: 'replace',
                value: expected,
                path: path
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch[path]).to.be.eq(expected);
            return done();
        });
        it('REPLACE: array by another array', done => {
            const expected = [{ value: 'test2' }];
            const path = 'emails';
            const patch = {
                op: 'replace',
                value: expected,
                path: path
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch[path]).to.be.eq(expected);
            return done();
        });
    });
    describe('add', () => {
        it('ADD: first level property without path', done => {
            const expected = 'newValue';
            const patch = { op: 'add', value: { newProperty: expected } };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.newProperty).to.be.eq(expected);
            return done();
        });
        it('ADD: first level property with path', done => {
            const expected = 'newValue';
            const patch = { op: 'add', value: expected, path: 'newProperty' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.newProperty).to.be.eq(expected);
            return done();
        });
        it('ADD: 2 level property with path', done => {
            const expected = 'toto';
            const patch = { op: 'add', value: expected, path: 'name.newProperty' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.newProperty).to.be.eq(expected);
            return done();
        });
        it('ADD: 2 level property without complete path', done => {
            const expected = 'toto';
            const patch = { op: 'add', value: { newProperty: expected }, path: 'name' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.newProperty).to.be.eq(expected);
            return done();
        });
        it('ADD: multiple at once with path', done => {
            const expectedNewProperty1 = 'toto';
            const expectedNewProperty2 = 'titi';
            const expectedNewProperty3 = 'tata';
            const patch1 = {
                op: 'add', value: {
                    newProperty1: expectedNewProperty1,
                    newProperty2: expectedNewProperty2
                }, path: 'name'
            };
            const patch2 = { op: 'add', value: { newProperty3: expectedNewProperty3 } };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1, patch2]);
            chai_1.expect(afterPatch.name.newProperty1).to.be.eq(expectedNewProperty1);
            chai_1.expect(afterPatch.name.newProperty2).to.be.eq(expectedNewProperty2);
            chai_1.expect(afterPatch.newProperty3).to.be.eq(expectedNewProperty3);
            return done();
        });
        it('ADD: multiple at once with exact path', done => {
            const expectedNewProperty1 = 'toto';
            const expectedNewProperty2 = 'titi';
            const expectedNewProperty3 = 'tata';
            const patch1 = {
                op: 'replace',
                value: expectedNewProperty1,
                path: 'name.newProperty1'
            };
            const patch2 = { op: 'replace', value: { newProperty3: expectedNewProperty3 } };
            const patch3 = {
                op: 'replace',
                value: expectedNewProperty2,
                path: 'name.newProperty2'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1, patch2, patch3]);
            chai_1.expect(afterPatch.name.newProperty1).to.be.eq(expectedNewProperty1);
            chai_1.expect(afterPatch.name.newProperty2).to.be.eq(expectedNewProperty2);
            chai_1.expect(afterPatch.newProperty3).to.be.eq(expectedNewProperty3);
            return done();
        });
        it('ADD: primary email object', done => {
            const expectedNewProperty1 = 'toto';
            const expectedNewProperty2 = 'titi';
            const patch1 = {
                op: 'add', value: {
                    newProperty1: expectedNewProperty1,
                    newProperty2: expectedNewProperty2
                }, path: 'emails[primary eq true]'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.emails[0].newProperty1).to.be.eq(expectedNewProperty1);
            chai_1.expect(afterPatch.emails[0].newProperty2).to.be.eq(expectedNewProperty2);
            chai_1.expect(afterPatch.emails[0].value).to.be.eq(scimUser.emails[0].value);
            return done();
        });
        it('ADD: primary email newProperty', done => {
            const expected = 'toto@toto.com';
            const patch = {
                op: 'add',
                value: expected,
                path: 'emails[primary eq true].newProperty'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.emails[0].newProperty).to.be.eq(expected);
            chai_1.expect(afterPatch.emails[0].primary).to.be.eq(true);
            return done();
        });
        it('ADD: nested array element', done => {
            scimUser.name.nestedArray = [{ primary: true, value: 'value1' }];
            const expectedNewProperty1 = 'toto';
            const expectedNewProperty2 = 'titi';
            const patch1 = {
                op: 'add', value: {
                    newProperty1: expectedNewProperty1,
                    newProperty2: expectedNewProperty2
                }, path: 'name.nestedArray[primary eq true]'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.name.nestedArray && afterPatch.name.nestedArray[0].newProperty1).to.be.eq(expectedNewProperty1);
            chai_1.expect(afterPatch.name.nestedArray && afterPatch.name.nestedArray[0].newProperty2).to.be.eq(expectedNewProperty2);
            return done();
        });
        it('ADD: If the target location specifies a multi-valued attribute, a new value is added to the attribute.', done => {
            scimUser.name.surName2 = ['toto', 'titi'];
            const newSurname = 'tata';
            const patch = {
                op: 'add', value: newSurname, path: 'name.surName2'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.surName2).to.contains('toto');
            chai_1.expect(afterPatch.name.surName2).to.contains(newSurname);
            return done();
        });
        it('ADD: If the target location specifies a single-valued attribute, the existing value is replaced', done => {
            scimUser.name.surName3 = 'surName';
            const newSurname = 'tata';
            const patch = {
                op: 'add', value: newSurname, path: 'name.surName3'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.surName3).to.be.eq(newSurname);
            return done();
        });
        it('ADD: If the target location specifies a multi-valued attribute, a new value is added to the attribute.', done => {
            scimUser.name.surName2 = ['toto', 'titi'];
            const newSurname = 'tata';
            const patch = {
                op: 'add', value: newSurname, path: 'name.surName2'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.surName2).to.contains('toto');
            chai_1.expect(afterPatch.name.surName2).to.contains('titi');
            chai_1.expect(afterPatch.name.surName2).to.contains(newSurname);
            return done();
        });
        it('ADD: If the target location specifies a multi-valued attribute, a new value is added to the attribute only if doesn\'t exist already.', done => {
            var _a;
            scimUser.name.surName2 = ['toto', 'titi'];
            const newSurname = 'titi';
            const patch = {
                op: 'add', value: newSurname, path: 'name.surName2'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.surName2).to.contains('toto');
            chai_1.expect((_a = afterPatch.name.surName2) === null || _a === void 0 ? void 0 : _a.filter(s => s === 'titi').length).to.eq(1);
            return done();
        });
        it('ADD: impossible to add a non object value to an object key', done => {
            const patch = { op: 'add', path: 'name', value: 'titi' };
            chai_1.expect(() => scimPatch_1.scimPatch(scimUser, [patch])).to.throw(scimPatch_1.InvalidScimPatchOp);
            return done();
        });
        it('ADD: should not modify anything if element not found', done => {
            scimUser.name.nestedArray = [{ primary: true, value: 'value1' }];
            const patch1 = {
                op: 'add', value: {
                    newProperty1: 'toto'
                }, path: 'name.nestedArray[toto eq true]'
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.name.nestedArray).to.be.eq(scimUser.name.nestedArray);
            return done();
        });
        it('ADD: with capital first letter for operation', done => {
            const expected = 'newValue';
            const patch = { op: 'Add', value: { newProperty: expected } };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.newProperty).to.be.eq(expected);
            return done();
        });
        it('ADD: with version number in path', done => {
            const expected = 'newValue';
            const path = 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department';
            delete scimUser[path];
            const patch = {
                op: 'add', value: 'newValue', path: path
            };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch[path]).to.be.eq(expected);
            return done();
        });
        it("ADD: array", (done) => {
            const expected = [{ value: "test2" }];
            const path = "emails";
            const patch = {
                op: "Add",
                value: expected,
                path,
            };
            const afterPatch = (scimPatch_1.scimPatch(scimUser, [patch]));
            chai_1.expect(afterPatch[path]).to.be.eq(expected);
            return done();
        });
    });
    describe('remove', () => {
        it('REMOVE: with no path', done => {
            const patch = { op: 'remove' };
            chai_1.expect(() => scimPatch_1.scimPatch(scimUser, [patch])).to.throw(scimPatch_1.NoPathInScimPatchOp);
            return done();
        });
        it('REMOVE: first level property with path', done => {
            const patch = { op: 'remove', path: 'active' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.active).not.to.exist;
            return done();
        });
        it('REMOVE: 2 level property with path', done => {
            const patch = { op: 'remove', path: 'name.familyName' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name.familyName).not.to.exist;
            return done();
        });
        it('REMOVE: full object', done => {
            const patch = { op: 'remove', path: 'name' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.name).not.to.exist;
            return done();
        });
        it('REMOVE: multiple property at once with path', done => {
            const patch1 = { op: 'remove', path: 'name' };
            const patch2 = { op: 'remove', path: 'active' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1, patch2]);
            chai_1.expect(afterPatch.name).not.to.exist;
            chai_1.expect(afterPatch.active).not.to.exist;
            return done();
        });
        it('REMOVE: primary email value', done => {
            const patch1 = { op: 'remove', path: 'emails[primary eq true].value' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.emails[0].value).not.to.exist;
            chai_1.expect(afterPatch.emails[0].primary).to.eq(true);
            return done();
        });
        it('REMOVE: nested array element', done => {
            scimUser.name.nestedArray = [{ primary: true, value: 'value1' }, { primary: false, value: 'value2' }];
            const patch1 = { op: 'remove', path: 'name.nestedArray[primary eq true]' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.name.nestedArray && afterPatch.name.nestedArray.length).to.eq(1);
            return done();
        });
        it('REMOVE: empty array should be unassigned', done => {
            scimUser.name.nestedArray = [{ primary: true, value: 'value1' }];
            const patch1 = { op: 'remove', path: 'name.nestedArray[primary eq true]' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch1]);
            chai_1.expect(afterPatch.name.nestedArray).not.to.exist;
            return done();
        });
        it('REMOVE: with capital first letter for operation', done => {
            const patch = { op: 'Remove', path: 'active' };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch.active).not.to.exist;
            return done();
        });
        it('REMOVE: with version number in path', done => {
            const path = 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department';
            const patch = { op: 'remove', path: path };
            const afterPatch = scimPatch_1.scimPatch(scimUser, [patch]);
            chai_1.expect(afterPatch[path]).not.to.exist;
            return done();
        });
    });
    describe('invalid requests', () => {
        it('INVALID: wrong operation name', done => {
            const patch = { op: 'delete', value: true, path: 'active' };
            chai_1.expect(() => scimPatch_1.scimPatch(scimUser, [patch])).to.throw(scimPatch_1.InvalidScimPatchRequest);
            return done();
        });
        it('INVALID: path filter invalid', done => {
            const patch = { op: 'replace', value: true, path: 'emails[name eq]' };
            chai_1.expect(() => scimPatch_1.scimPatch(scimUser, [patch])).to.throw(scimPatch_1.InvalidScimPatch);
            return done();
        });
        it('INVALID: path request missing', done => {
            const patch = { op: 'replace', value: true, path: 'emails[name eq "toto"' };
            chai_1.expect(() => scimPatch_1.scimPatch(scimUser, [patch])).to.throw(scimPatch_1.InvalidScimPatchOp);
            return done();
        });
        it('INVALID: search on a mono valued attribute', done => {
            const patch = { op: 'replace', value: true, path: 'username[name eq "toto"]' };
            chai_1.expect(() => scimPatch_1.scimPatch(scimUser, [patch])).to.throw(scimPatch_1.InvalidScimPatchOp);
            return done();
        });
        it('INVALID: invalid parameter in scim filter', done => {
            const patch = {
                op: 'replace',
                value: true,
                path: 'emails[\' eq true].value'
            };
            chai_1.expect(() => scimPatch_1.scimPatch(scimUser, [patch])).to.throw(scimPatch_1.InvalidScimPatchOp);
            return done();
        });
    });
});
//# sourceMappingURL=scimPatch.test.js.map