const knex = require('../db/knex');

const Notify = {
  async getSetting() {
    try {
      const data = await knex('push_notification_setting').select('*').where({id:1});
      return data;
    } catch (error) {
      return [];
    }    
  },
  async getAuthCode() {
    try {
      const data = await knex('push_notification_setting').select('*').where({id:1});
      if (data.length>0) {
        return data[0]['authorize_code'];
      }
      else
      {
        return '';
      }      
    } catch (error) {
      console.log(error);
      return '';
    }    
  },  
  async uppateTokenById(id,data) {
    try {
      const updateFields = {};
      if (data.access_token !== undefined) {
        updateFields.access_token = data.access_token;
      }
      if (data.refresh_token !== undefined) {
        updateFields.refresh_token = data.refresh_token;
      }

      if (data.refresh_unsuccess_count !== undefined) {
        updateFields.refresh_unsuccess_count = data.refresh_unsuccess_count;
      }
      
      if (Object.keys(updateFields).length > 0) {
        await knex('push_notification_setting')
          .update(updateFields)
          .where({ id: id });
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async increseCountUnsuccesfulById(id) {
    try {

      if (Object.keys(updateFields).length > 0) {
        await knex('push_notification_setting')
          .update(
            {refresh_unsuccess_count : knex.raw('refresh_unsuccess_count + 1')}
          )
          .where({ id: id });
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

module.exports = Notify;
