require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET||'BANKBANKBANK';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN||'1h';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { redisClient } = require('../utils/redis');
const { sendOtp } = require('../utils/smsservice');
const knex = require('../db/connection'); // เชื่อมกับ DB
const { v4: uuidv4 } = require('uuid');

const { password_hash, password_verify } = require('../utils/password');
const { default: axios } = require('axios');

const userModel = require('../models/user.model');
const notifyModel = require('../models/notifysetting.model');

// POST /api/setauthorizecode
router.post('/setauthorizecode', async (req, res) =>  {
   try {

      const { authorizecode } = req.body;
      const authcode = await knex('push_notification_setting').update(
        {
          authorize_code: authorizecode
        }
      ).where
      (
        {id:1}
      );

      let data ={
            "token_uri":"https://oauth2.googleapis.com/token",
            "code":authorizecode
          }

      let response = await axios.post("https://developers.google.com/oauthplayground/exchangeAuthCode"
      , data
      );

      if (response.data.error) {
        return res.status(401).json({ error: response.data.error });
      }

      const updateToken =await notifyModel.uppateTokenById(1,
        {
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          refresh_unsuccess_count: 0,
        }
      );
      if (updateToken) {
        return res.status(200).json({ message : 'success'});
      }
      else
      {
        return res.status(200).json({ error : 'unsuccess'});
      }
      
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: 'unsuccess.' });
    }
});

router.get('/exchangeauthorizecode', async (req, res) =>  {
    
   try {

      const authcode = await notifyModel.getAuthCode();
      if (authcode.length>0) {          
          let data ={
            "token_uri":"https://oauth2.googleapis.com/token",
            "code":authcode
          }

          try {
            let response = await axios.post("https://developers.google.com/oauthplayground/exchangeAuthCode"
            , data
            );

            if (response.data.error) {
              return res.status(401).json({ error: response.data.error });
            }

            const updateToken =await notifyModel.uppateTokenById(1,
              {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                refresh_unsuccess_count: 0,
              }
            );
            if (updateToken) {
              return res.status(200).json({ message : 'success'});
            }
            else
            {
              return res.status(200).json({ error : 'unsuccess'});
            }
            
          } catch (err) {
            console.log(err);
            return res.status(401).json({ error: err.message });
          }
      }      
      return res.status(401).json({ error: 'unsuccess.' });
      
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: 'unsuccess.' });
    }
});

router.post('/sendnotify', async (req, res) =>  {
  
   try {

      const {channel_id,title,body,data } = req.body;

      const phone = req.body.phone;
      const email = req.body.email;

      if (!email && !phone) {
          return res.status(401).json({ error: 'Invalid parameter.' });
      }

      const users = userModel.findUserByEmailOrPhone(email,phone);

      if (users.length==0) {
          return res.status(401).json({ error: 'not found user.' });
      }

      const notifySetting = notifyModel.getSetting();
      
      if (notifySetting.length==0) {
          return res.status(401).json({ error: 'not found notify setting.' });
      }

      let dataReq = {
        "message" :{
            "token":users[0]['firebase_token'],
            "data" : data,
            "notification": {            
                "title": title,
                "body": body            
            },
            "android": {
                "notification": {
                "channel_id": channel_id
                }
            }  
        }  
      }

      let response;
      try {
        response = await axios.post(
          "https://fcm.googleapis.com/v1/projects/checkentry-6ea41/messages:send",
          dataReq,
          {
        headers: {
          Authorization: `Bearer ${notifySetting[0]['access_token']}`
        }
          }
        );
        
      } catch (err) {
        console.log('FCM error:', err.response ? err.response.data : err.message);
        response = err.response.data.error;
        // Do not throw, just log and continue
      }

      if (response.status=="UNAUTHENTICATED")
      {
          let dataReq2 = 
          {
              "token_uri":"https://oauth2.googleapis.com/token",
              "refresh_token":`${notifySetting[0]['refresh_token']}`
          }
          
          try {
            response = await axios.post(
              "https://developers.google.com/oauthplayground/refreshAccessToken",
              dataReq2
            );
            
          } catch (err) {
            console.log('RefreshToken error:', err.response ? err.response.data : err.message);
            response = err.response.data.error;
          }

          if (response.status=="UNAUTHENTICATED")
          {
              return res.status(401).json({ error: 'Cannot refresh token' });
          }
          else
          {
              const updateToken = await notifyModel.uppateTokenById(1,
                {
                  access_token: response.data.access_token,
                  refresh_token: response.data.refresh_token,
                  refresh_unsuccess_count: 0,
                }
              );
              if (updateToken) {
                return res.status(200).json({ message : 'refresh token success , please send notify again'});  
              }
              else
              {
                return res.status(200).json({ message : 'refresh token unsuccess'});  
              }
              
          }
      }
      
      return res.status(200).json({ message : 'success'});
      
    } catch (err) {
      console.log(err.message);
      return res.status(401).json({ error: 'unsuccess.' });
    }
});






module.exports = router;
