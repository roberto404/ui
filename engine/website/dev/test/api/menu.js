
import { expect } from 'chai';
import request from 'superagent';
import { exec } from 'child_process';

const API_URL = 'http://rs.loc/api/v3/website/menu';

describe.only('API › website/menu', () =>
{
  before(() =>
  {
    // exec('mysqldump -u root -probbancs rs categories_web --add-drop-table > categories_web_backup.sql', () => done());
    // exec('mysqldump -u root -probbancs rs categories_web --add-drop-table --no-data > categories_web_empty.sql', () => done());
  });

  after((done) =>
  {
    exec('mysql -u root -probbancs rs < ./test/api/menu.sql', () => done());
    // exec('mysql -u root -probbancs rs < categories_web_backup.sql', () => done());
    // exec('rm categories_web_backup.sql');
    // exec('rm categories_web_empty.sql');
  });

  beforeEach((done) =>
  {
    // exec('mysql -u root -probbancs rs < categories_web_empty.sql');
    exec('mysql -u root -probbancs rs < ./test/api/menu.sql', () => done());
  });

  it('deleteOne last child', (done) =>
  {
    request
      .del(`${API_URL}/12`)
      .type('form')
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          // {
          //   id: '12',
          //   status: '1',
          //   title: 'Item 2.3',
          //   pid: '8',
          //   pos: '2',
          //   props: null,
          // },
        ]);

        done();
      });
  });

  it('deleteOne first child', (done) =>
  {
    request
      .del(`${API_URL}/7`)
      .type('form')
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          // {
          //   id: '7',
          //   status: '1',
          //   title: 'Item 2.1',
          //   pid: '8',
          //   pos: '0',
          //   props: null,
          // },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            // pos: '1',
            pos: '0',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            // pos: '2',
            pos: '1',
            props: null,
          },
        ]);

        done();
      });
  });

  it('deleteOne inter child', (done) =>
  {
    request
      .del(`${API_URL}/9`)
      .type('form')
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          // {
          //   id: '9',
          //   status: '1',
          //   title: 'Item 2.2',
          //   pid: '8',
          //   pos: '1',
          //   props: null,
          // },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            // pos: '2',
            pos: '1',
            props: null,
          },
        ]);

        done();
      });
  });

  it('deleteOne last parent', (done) =>
  {
    request
      .del(`${API_URL}/6`)
      .type('form')
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          // {
          //   id: '6',
          //   status: '1',
          //   title: 'Item 3',
          //   pid: '0',
          //   pos: '2',
          //   props: null,
          // },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });

  it('deleteOne first parent', (done) =>
  {
    request
      .del(`${API_URL}/10`)
      .type('form')
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            // pos: '2',
            pos: '1',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            // pos: '1',
            pos: '0',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '1',
            props: null,
          },
          // {
          //   id: '10',
          //   status: '1',
          //   title: 'Item 1',
          //   pid: '0',
          //   pos: '0',
          //   props: null,
          // },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });

  it('deleteOne inter parent', (done) =>
  {
    request
      .del(`${API_URL}/8`)
      .type('form')
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            // pos: '2',
            pos: '1',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          // {
          //   id: '8',
          //   status: '1',
          //   title: 'Item 2',
          //   pid: '0',
          //   pos: '1',
          //   props: null,
          // },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });


  it('createOne last child', (done) =>
  {
    request
      .post(`${API_URL}`)
      .type('form')
      .send({
        pos: '3',
        pid: '8',
        title: 'Item 2.4',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '2',
            props: null,
          },
          {
            id: '13',
            status: '1',
            title: 'Item 2.4',
            pid: '8',
            pos: '3',
            props: null,
          },
        ]);

        done();
      });
  });

  it('createOne first child', (done) =>
  {
    request
      .post(`${API_URL}`)
      .type('form')
      .send({
        pos: '0',
        pid: '8',
        title: 'Item 2.4',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '1',
            // pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            // pos: '1',
            pos: '2',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '3',
            // pos: '2',
            props: null,
          },
          {
            id: '13',
            status: '1',
            title: 'Item 2.4',
            pid: '8',
            pos: '0',
            props: null,
          },
        ]);

        done();
      });
  });

  it('createOne inter child', (done) =>
  {
    request
      .post(`${API_URL}`)
      .type('form')
      .send({
        pos: '1',
        pid: '8',
        title: 'Item 2.4',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            // pos: '1',
            pos: '2',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '3',
            // pos: '2',
            props: null,
          },
          {
            id: '13',
            status: '1',
            title: 'Item 2.4',
            pid: '8',
            pos: '1',
            props: null,
          },
        ]);

        done();
      });
  });


  // UPDATE

  it('updateOne last child to first child', (done) =>
  {
    request
      .post(`${API_URL}/12`)
      .type('form')
      .send({
        pos: '0',
        // pid: '8',
        // title: 'Item 2.3',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            // pos: '0',
            pos: '1',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            // pos: '1',
            pos: '2',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            // pos: '2',
            pos: '0',
            props: null,
          },
        ]);

        done();
      });
  });

  it('updateOne last child to last child', (done) =>
  {
    request
      .post(`${API_URL}/12`)
      .type('form')
      .send({
        pos: '2',
        // pid: '8',
        // title: 'Item 2.3',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });

  it('updateOne last child to inter child', (done) =>
  {
    request
      .post(`${API_URL}/12`)
      .type('form')
      .send({
        pos: '1',
        // pid: '8',
        // title: 'Item 2.3',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            // pos: '1',
            pos: '2',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            // pos: '2',
            pos: '1',
            props: null,
          },
        ]);

        done();
      });
  });

  it('updateOne last child to first parent', (done) =>
  {
    request
      .post(`${API_URL}/12`)
      .type('form')
      .send({
        pos: '0',
        pid: '0',
        // title: 'Item 2.3',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            // pos: '2',
            pos: '3',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            // pos: '1',
            pos: '2',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            // pos: '0',
            pos: '1',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '0',
            pos: '0',
            // pid: '8',
            // pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });

  it('updateOne inter child to inter parent', (done) =>
  {
    request
      .post(`${API_URL}/9`)
      .type('form')
      .send({
        // title: 'Item 2.2',
        pid: '0',
        pos: '1',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            // pos: '2',
            pos: '3',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            // pos: '1',
            pos: '2',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '0',
            pos: '1',
            // pid: '8',
            // pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '1',
            // pid: '8',
            // pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });

  it('updateOne first child to last parent', (done) =>
  {
    request
      .post(`${API_URL}/7`)
      .type('form')
      .send({
        // title: 'Item 2.1',
        pid: '0',
        pos: '3',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '0',
            pos: '3',
            // pid: '8',
            // pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '0',
            // pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '1',
            // pid: '8',
            // pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });

  it('updateOne child to next child', (done) =>
  {
    request
      .post(`${API_URL}/11`)
      .type('form')
      .send({
        title: 'Item 1.1',
        pid: '8',
        pos: '1',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            pos: '1',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '2',
            // pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '0',
            pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            // pid: '10',
            // pos: '0',
            pid: '8',
            pos: '1',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '3',
            // pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });

  it('updateOne parent to child', (done) =>
  {
    request
      .post(`${API_URL}/10`)
      .type('form')
      .send({
        title: 'Item 1',
        pid: '8',
        pos: '1',
        token: 'pOIfdu4s',
      })
      .then((response) =>
      {
        expect(response.body.records).to.deep.equal([
          {
            id: '6',
            status: '1',
            title: 'Item 3',
            pid: '0',
            pos: '1',
            // pos: '2',
            props: null,
          },
          {
            id: '7',
            status: '1',
            title: 'Item 2.1',
            pid: '8',
            pos: '0',
            props: null,
          },
          {
            id: '8',
            status: '1',
            title: 'Item 2',
            pid: '0',
            // pos: '1',
            pos: '0',
            props: null,
          },
          {
            id: '9',
            status: '1',
            title: 'Item 2.2',
            pid: '8',
            pos: '2',
            // pos: '1',
            props: null,
          },
          {
            id: '10',
            status: '1',
            title: 'Item 1',
            pid: '8',
            pos: '1',
            // pid: '0',
            // pos: '0',
            props: null,
          },
          {
            id: '11',
            status: '1',
            title: 'Item 1.1',
            pid: '10',
            pos: '0',
            props: null,
          },
          {
            id: '12',
            status: '1',
            title: 'Item 2.3',
            pid: '8',
            pos: '3',
            // pos: '2',
            props: null,
          },
        ]);

        done();
      });
  });
});
