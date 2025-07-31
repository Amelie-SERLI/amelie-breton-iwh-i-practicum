const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();

const PRIVATE_APP_ACCESS = process.env.PRACT_PRIV_APP;

// ROUTE 1 - app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {

    const weapons = 'https://api.hubapi.com/crm/v3/objects/2-145281523?limit=10&archived=false&properties=name&properties=price&properties=use_description';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(weapons, { headers });
        const data = resp.data.results;

        //console.log(data.map(w => w.properties));

        console.log('Fetched weapons:', data.map(w => w.properties.name), data.map(w => w.properties.hs_object_id)); // fetch nothing

        res.render('weapons', { title: 'Home | HubSpot APIs', weapons: data });      
    } catch (error) {
        console.error(error);
    }

});

// ROUTE 2 - app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

app.get('/updates', (req, res) => {
    res.render('updates', { title: 'Create a new Weapon' });
});

app.get('/updates/:id', async (req, res) => {
  const weaponId = req.params.id;
  console.log(weaponId);
  const url = `https://api.hubapi.com/crm/v3/objects/2-145281523/${weaponId}?properties=name&properties=price&properties=use_description`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  console.log("fetching object");

  try {
    const response = await axios.get(url, { headers });
    const weapon = response.data;
    console.log(weapon);
    res.render('updates', {
      title: 'Update Weapon',
      weapon
    });
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).send('Could not load weapon');
  }
});

// TODO: ROUTE 3 - new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here


app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "name": req.body.name,
            "price": req.body.price,
            "use_description": req.body.use_description
        }
    }

    const addWeaponUrl = `https://api.hubapi.com/crm/v3/objects/2-145281523`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(addWeaponUrl, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});

app.post('/update-cobj/:id', async (req, res) => {
    const weaponId = req.params.id;
    const update = {
        properties: {
            "name": req.body.name,
            "price": req.body.price,
            "use_description": req.body.use_description
        }
    }

    const updateWeaponUrl = `https://api.hubapi.com/crm/v3/objects/2-145281523/${weaponId}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateWeaponUrl, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));