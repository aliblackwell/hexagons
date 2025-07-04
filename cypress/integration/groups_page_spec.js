import getGroups from '../fixtures/getGroups.json';
import getCoreSubjects from '../fixtures/getCoreSubjects.json';
import getAllPupilsByGroup from '../fixtures/getAllPupilsByGroup.json';
import getLevelsForOverview from '../fixtures/getLevelsForOverview.json';
import getSingleGroup from '../fixtures/getSingleGroup.json';
import getGroupsEmpty from '../fixtures/getGroupsEmpty.json';
import { flattenDataAttributes } from '../utils/flattenDataAttributes';

context('Groups pages', () => {
  beforeEach(() => {
    cy.login('Teacher');
    let getSingleSubjectBySlug = {
      body: {
        data: {
          subjects: {
            data: [
              {
                id: '29',
                attributes: {
                  name: 'Number',
                  slug: 'number'
                }
              }
            ]
          }
        }
      }
    };
    cy.mockGraphQL([
      { query: 'getSingleSubjectBySlug', data: getSingleSubjectBySlug },
      { query: 'getSingleGroup', data: getSingleGroup },
      { query: 'getGroups', data: getGroups },
      { query: 'getCoreSubjects', data: getCoreSubjects },
      { query: 'getLevelsForOverview', data: getLevelsForOverview },
    ]);
  });

  describe('Displaying groups and pupils throughout app', () => {
    beforeEach(() => {
      cy.mockGraphQL([{ query: 'getAllPupilsByGroup', data: getAllPupilsByGroup }]);
    });

    describe('Without assigned groups', () => {
      beforeEach(() => {
        cy.mockGraphQL([
          {
            query: 'getGroups',
            data: getGroupsEmpty,
            variable: { key: 'teacherId', value: 76 },
          },
        ]);

      });

      it.skip('Displays subject overview card and correct breadcrumb on page without group slug', () => {
        cy.visit('/pupils');
        cy.waitForSpinners()
        cy.navigateToPupilsClass1(); // Sets group in localStorage
        cy.visit('/subjects/number');
        cy.wait('@gqlgetSingleSubjectBySlugQuery');
        cy.wait('@gqlgetCoreSubjectsQuery');
        cy.waitForSpinners()
        cy.assertSubjectCardIsVisible();
        cy.get('[data-test-id=final-crumb]').contains('D1');
      });

      it('Pupils view: Displays a notice to choose pupils when no active group is present', () => {
        cy.visit('/pupils');
        cy.get('[data-test-id=please-choose-group]').should('exist');
      });

      it('Subjects view: Displays a notice to choose pupils when no active group is present', () => {
        cy.visit('/subjects/number');
        cy.get('[data-test-id=please-choose-group]').should('exist');
      });

      it('Rainbow Awards view: Displays a notice to choose pupils when no active group is present', () => {
        cy.visit('/rainbow-awards/being-a-good-friend');
        cy.get('[data-test-id=please-choose-group]').should('exist');
      });

      it('Lets user choose a group and sets it to localStorage', () => {
        cy.visit('/pupils');
        cy.get('[data-test-id=d-1-link]').click();

        cy.waitForSpinners();
        cy.location().should((loc) => {
          expect(loc.pathname).to.eq('/pupils/d-1');
          expect(localStorage.getItem('active-group-slug')).to.eq('d-1');
          expect(localStorage.getItem('active-group-id')).to.eq('46');
          expect(localStorage.getItem('active-group-name')).to.eq('D1');
        });
      });
    });
    describe('With assigned groups', () => {
      beforeEach(() => {
        let getTeacherGroups = {
          body: {
            data: {
              groups: {
                data: [
                  {
                    id: '254',
                    attributes: {
                      name: 'EFL',
                      slug: 'efl'
                    }
                  }
                ]
              }
            }
          }
        };
        cy.mockGraphQL([
          { query: 'getGroups', data: getTeacherGroups, variable: { key: 'teacherId', value: 76 } },
        ]);
      });

      it('Pupils view: Displays a notice to choose pupils when no active group is present', () => {
        cy.visit('/pupils');
        cy.waitForSpinners();
        cy.get('[data-test-id=please-choose-group]').should('exist');
      });
    });
  });

  describe('localStorage thorough testing', () => {
    beforeEach(() => {
      cy.login('Teacher');
      let getAllPupilsByGroupClass1 = {
        body: {
          data: {
            pupils: {
              data: [
                {
                  id: '170',
                  attributes: {
                    name: 'Jamie Jones',
                    groups: {
                      data: [
                        { id: '1', attributes: { name: 'Class 1', slug: 'class-1' } },
                        { id: '2', attributes: { name: 'Class 2', slug: 'class-2' } },
                        { id: '3', attributes: { name: 'Class 3', slug: 'class-3' } }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      };
      cy.mockGraphQL([{ query: 'getAllPupilsByGroup', data: getAllPupilsByGroupClass1 }]);
    });

    it('Displays group from localStorage', () => {
      window.localStorage.setItem('active-group-slug', 'class-1');
      window.localStorage.setItem('active-group-id', '241');
      window.localStorage.setItem('active-group-name', 'Class 1');
      window.localStorage.setItem('active-group-org-id', 1);
      cy.visit('/pupils');
      cy.get('[data-test-id=second-crumb]').contains('Class 1');
      cy.get('[data-test-id="groups-list-pupil-170"]').should('exist');
    });

    it("Doesn't display group if orgId is different to current user", () => {
      window.localStorage.setItem('active-group-slug', 'class-1');
      window.localStorage.setItem('active-group-id', '241');
      window.localStorage.setItem('active-group-name', 'Class 1');
      window.localStorage.setItem('active-group-org-id', '2');
      cy.visit('/pupils');
      cy.get('[data-test-id=second-crumb]').should('not.exist');
      cy.get('[data-test-id="groups-list-pupil-170"]').should('not.exist');
      cy.get('[data-test-id="please-choose-group"]').should('exist');
    });
  });
});
