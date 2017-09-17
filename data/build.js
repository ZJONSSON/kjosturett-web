import fs from 'fs';
const { promisify } = require('util');
import marked from 'marked';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

const categories = [
  {
    name: 'Velferðarmál',
    url: 'velferdarmal'
  },
  {
    name: 'Húsnæðismál',
    url: 'husnaedismal'
  },
  {
    name: 'Atvinnumál',
    url: 'atvinnumal'
  },
  {
    name: 'Heilbrigðismál',
    url: 'heilbrigdismal'
  },
  {
    name: 'Skattamál',
    url: 'skattamal'
  },
  {
    name: 'Evrópumál',
    url: 'evropumal'
  },
  {
    name: 'Stjórnarskrármál',
    url: 'stjornarskrarmal'
  },
  {
    name: 'Menntamál',
    url: 'menntamal'
  },
  {
    name: 'Sjávarútvegsmál',
    url: 'sjavarutvegsmal'
  },
  {
    name: 'Umhverfismál',
    url: 'umhverfismal'
  },
  {
    name: 'Samgöngumál',
    url: 'samgongumal'
  },
  {
    name: 'Byggðarmál',
    url: 'byggdarmal'
  }
];

export const parties = [
  {
    letter: 'A',
    url: 'bjort-framtid',
    name: 'Björt Framtíð'
  },
  {
    letter: 'B',
    url: 'framsoknarflokkurinn',
    name: 'Framsóknarflokkurinn'
  },
  {
    letter: 'C',
    url: 'vidreisn',
    name: 'Viðreisn'
  },
  {
    letter: 'D',
    url: 'sjalfstaedisflokkurinn',
    name: 'Sjálfstæðisflokkurinn'
  },
  {
    letter: 'S',
    url: 'samfylkingin',
    name: 'Samfylkingin'
  },
  {
    letter: 'V',
    url: 'vinstri-graen',
    name: 'Vinstri Græn'
  },
  {
    letter: 'P',
    url: 'piratar',
    name: 'Píratar'
  }
];

writeFile(
  '../src/lib/data/categories.json',
  JSON.stringify(categories, null, 0),
  console.log
);

writeFile(
  '../src/lib/data/parties.json',
  JSON.stringify(parties, null, 0),
  console.log
);

categories.forEach(async category => {
  let out = await Promise.all(
    parties.map(async party => {
      const key = `./${party.url}/${category.url}.md`;

      let data = '';
      try {
        data = await readFile(key);
        data = data.toString();
      } catch (e) {
        console.error('Could not load key', key, process.cwd());
      }
      console.log('got it', party, data);
      return {
        ...party,
        statement: data ? marked(data) : ''
      };
    })
  );

  fs.writeFile(
    `../src/lib/data/${category.url}.json`,
    JSON.stringify(out, null, 0),
    console.log
  );
});

parties.forEach(async party => {
  let out = await Promise.all(
    categories.map(async category => {
      const key = `./${party.url}/${category.url}.md`;

      let data = '';
      try {
        data = await readFile(key);
        data = data.toString();
      } catch (e) {
        console.error('Could not load key', key, process.cwd());
      }
      console.log('got it', party, data);
      return {
        category: category.url,
        statement: data ? marked(data) : ''
      };
    })
  );

  fs.writeFile(
    `../src/lib/data/${party.url}.json`,
    JSON.stringify(out, null, 0),
    console.log
  );
});

// export const category = categoryUrl => {
//   console.log('looking up', categoryUrl);
//
//   return parties.map(p => {
//     let party = { ...p };
//
//     const key = `./data/${party.url}/${categoryUrl}.md`;
//
//     try {
//       // party.statement = require(key);
//       import(key).then(d => console.log('GOT IT', d));
//     } catch (e) {
//       console.error('did not find data', e, key);
//     }
//
//     return p;
//   });
// };