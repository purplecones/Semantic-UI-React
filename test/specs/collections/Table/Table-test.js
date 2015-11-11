import _ from 'lodash';
import faker from 'faker';
import React from 'react';
import {Table, TableColumn} from 'stardust';

describe('Table', () => {
  let randomDataKey;
  const tableData = _.times(_.random(1, 20), () => {
    return {
      imageUrl: faker.image.avatar(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.image.email(),
      permissions: {
        read: !!_.random(),
        write: !!_.random(),
        delete: !!_.random()
      }
    };
  });

  beforeEach(() => {
    randomDataKey = _.sample(_.keys(_.first(tableData)));
  });

  describe('header', () => {
    it('uses Start Cased column dataKey as the default content', () => {
      render(
        <Table data={tableData}>
          <TableColumn dataKey='firstName' />
        </Table>
      )
        .findClass('sd-table-header')
        .textContent.should.equal('First Name');
    });

    it('renders contents with headerRenderer', () => {
      render(
        <Table data={tableData}>
          <TableColumn dataKey={randomDataKey} headerRenderer={() => 'YO!'} />
        </Table>
      )
        .findClass('sd-table-header')
        .textContent.should.equal('YO!');
    });
  });

  describe('cell', () => {
    it('uses object values as default contents', () => {
      render(
        <Table data={tableData}>
          <TableColumn dataKey={randomDataKey} />
        </Table>
      )
        .scryClass('sd-table-cell')
        .forEach((tableCell, i) => {
          const originalItem = tableData[i][randomDataKey];
          const originalValue = Table.getSafeCellContents(originalItem);
          tableCell.textContent.should.equal(originalValue);
        });
    });

    it('renders contents with the cellRenderer', () => {
      render(
        <Table data={tableData}>
          <TableColumn dataKey={randomDataKey} cellRenderer={() => 'REDACTED'} />
        </Table>
      )
        .scryClass('sd-table-cell')
        .forEach((tableCell) => {
          tableCell.textContent.should.equal('REDACTED');
        });
    });

    it('stringifies contents if they are objects', () => {
      // use the permissions key here as it is an object
      render(
        <Table data={tableData}>
          <TableColumn dataKey='permissions' />
        </Table>
      )
        .scryClass('sd-table-cell')
        .forEach((tableCell) => {
          tableCell.textContent.should.be.a('string');
        });
    });
  });

  describe('row', () => {
    it('only contains cells that were defined in TableColumns', () => {
      render(
        <Table data={tableData}>
          <TableColumn dataKey={randomDataKey} />
        </Table>
      )
        .scryClass('sd-table-cell')
        .forEach((tableCell, i) => {
          // remove this table's column from the current data object
          // then expect this cell's value to not be found in the object
          const itemWithoutRandomKey = _.omit(tableData[i], randomDataKey);
          const cellText = tableCell.textContent;

          _.each(itemWithoutRandomKey, val => {
            Table.getSafeCellContents(val).should.not.equal(cellText);
          });
        });
    });
  });
});