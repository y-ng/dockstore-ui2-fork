/*
 *    Copyright 2023 OICR, UCSC
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { setTokenUserViewPortPlatformPartner, setPlatformPartnerRole } from '../../support/commands';

describe('Platform Partner UI', () => {
  setTokenUserViewPortPlatformPartner();
  beforeEach(() => {
    cy.visit('');

    // Select dropdown
    cy.get('[data-cy=dropdown-main]:visible').click();
  });

  describe('Profile', () => {
    it('Platform Partner status indicated on profile page', () => {
      setPlatformPartnerRole();
      cy.get('#dropdown-accounts').click();
      cy.get('[data-cy=account-is-platform-partner]').should('exist');
    });
  });
});
