require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'BANKBANKBANK';

const path = require('path');
const express = require('express');
const utils = require('./utils/ipaddress');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const notifyRoutes = require('./routes/notify');
const cron = require('node-cron');
const notifyModel = require('./models/notifysetting.model');
const { default: axios } = require('axios');

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// ตั้งค่า view engine เป็น ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notify', notifyRoutes);


app.get('/', async (req, res) => {    
  const ip = utils.getClientIp(req);
  console.log("Get from :", ip)
  res.json({ message: "Get server", ip });
});

// Schedule a task to run every 5 minutes
cron.schedule('*/1 * * * *', async () => {
  console.log('Refresh Token', new Date().toLocaleString());
  try {
    let tryAgain = true;
    let countRound = 1;
    while(tryAgain && countRound<10)
    {
        console.log(`tryAgain Round : ${countRound}`)
        tryAgain = await refreshToken();
        countRound++;
    }
   
  } catch (error) {
    console.log(error);
  }
});

async function refreshToken()
{
     const notify = await notifyModel.getSetting();
    if (notify.length>0) {        
        if (notify[0]['refresh_unsuccess_count']>3) {
          return false;
        }
        else
        {
          let dataReq2 = 
          {
              "token_uri":"https://oauth2.googleapis.com/token",
              "refresh_token":`${notify[0]['refresh_token']}`
          }

          try {

            let response = await axios.post(
              "https://developers.google.com/oauthplayground/refreshAccessToken",
              dataReq2
            );

            if (response.status=="UNAUTHENTICATED")
            {
                const updateSetting = await notifyModel.increseCountUnsuccesfulById(1);
                return true;
            }
            else
            {
                console.log(response.data);
                const updateToken = await notifyModel.uppateTokenById(1,
                  {
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                  }
                );
                if (updateToken) {
                  console.log('Refresh Token Successful');
                  return false;
                }
                else
                {
                  console.log('Refresh Token UnSuccessful');
                  const updateSetting = await notifyModel.increseCountUnsuccesfulById(1);
                    
                  return true;
                }
                
            }

          } catch (err) {
            const updateSetting = await notifyModel.increseCountUnsuccesfulById(1);
            console.log('RefreshToken error:', err.response ? err.response.data : err.message);
            return true;
          }
          
        }
    }
    else
    {
        console.log('Not found setting');
        return false;
    }
}


module.exports = app;
