import Axios from "../config/config";
export const LMS_STORAGE = '#';

export const LOGIN_API = async (body) => {
    try {
        const response = await Axios.post('login/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LOGOUT_API = async (body) => {
    try {
        const response = await Axios.post('logout/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const PHISHING_DASHBOARD = async (body) => {
    try {
        const response = await Axios.post('phishing-dashboard/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};





//SMTP APIS.....
export const LIST_SMTP = async (body) => {
    try {
        const response = await Axios.post('smtp-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_SMTP = async (body) => {
    try {
        const response = await Axios.post('add-smtp/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_SMTP = async (body) => {
    try {
        const response = await Axios.post('edit-smtp/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_SMTP = async (body) => {
    try {
        const response = await Axios.post('view-smtp/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const SMTP_STATUS = async (body) => {
    try {
        const response = await Axios.post('smtp-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DELETE_SMTP = async (body) => {
    try {
        const response = await Axios.post('delete-smtp/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

//USER APIS 

export const ADD_USER = async (body) => {
    try {
        const response = await Axios.post('add-user/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EDIT_USER  = async (body) => {
    try {
        const response = await Axios.post('edit-user/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_USER  = async (body) => {
    try {
        const response = await Axios.post('view-user/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const LIST_USER  = async (body) => {
    try {
        const response = await Axios.post('user-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_CAMPAIGN_USER  = async (body) => {
    try {
        const response = await Axios.post('list-campaign-user/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const USER_STATUS  = async (body) => {
    try {
        const response = await Axios.post('user-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



//EMAIL TEMPLATE APIS

export const ADD_EMAIL  = async (body) => {
    try {
        const response = await Axios.post('add-email/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_EMAIL  = async (body) => {
    try {
        const response = await Axios.post('edit-email/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_EMAIL  = async (body) => {
    try {
        const response = await Axios.post('view-email/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_EMAIL  = async (body) => {
    try {
        const response = await Axios.post('list-email/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};
export const DELETE_EMAIL  = async (body) => {
    try {
        const response = await Axios.post('delete-email/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_LANDING  = async (body) => {
    try {
        const response = await Axios.post('add-landing/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EDIT_LANDING  = async (body) => {
    try {
        const response = await Axios.post('edit-landing/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_LANDING  = async (body) => {
    try {
        const response = await Axios.post('view-landing/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const LIST_LANDING_PAGE  = async (body) => {
    try {
        const response = await Axios.post('list-landing-page/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const CREATE_GROUP  = async (body) => {
    try {
        const response = await Axios.post('create-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_GROUP  = async (body) => {
    try {
        const response = await Axios.post('list-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_GROUP  = async (body) => {
    try {
        const response = await Axios.post('edit-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_GROUP  = async (body) => {
    try {
        const response = await Axios.post('view-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DELETE_USER_GROUP  = async (body) => {
    try {
        const response = await Axios.post('delete-user-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const ADD_CAMPAIGN = async (body) => {
    try {
        const response = await Axios.post('add-campaign/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const LIST_CAMPAIGN = async (body) => {
    try {
        const response = await Axios.post('list-campaign/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const SOFT_DELETE = async (body) => {
    try {
        const response = await Axios.post('delete-campaign/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const CAMPAIGN_TRACKING = async (body) => {
    try {
        const response = await Axios.post('campaign-tracking/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const BULK_ADD_USER = async (body) => {
    try {
        const response = await Axios.post('bulk-add-user/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_IMPORT_USER = async (body) => {
    try {
        const response = await Axios.post('list-import-user/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const IMPORT_TRACKING_LIST = async (body) => {
    try {
        const response = await Axios.post('import-tracking-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const TOOL_SETTING = async (body) => {
    try {
        const response = await Axios.post('tool-setting-view/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

//LMS LEARNER API 

export const CREATE_LEARNER_GROUP = async (body) => {
    try {
        const response = await Axios.post('create-learner-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EDIT_LEARNER_GROUP = async (body) => {
    try {
        const response = await Axios.post('edit-learner-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const LIST_LEARNER_GROUP = async (body) => {
    try {
        const response = await Axios.post('list-learner-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_LEARNER_GROUP = async (body) => {
    try {
        const response = await Axios.post('view-learner-group/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LEARNER_LIST = async (body) => {
    try {
        const response = await Axios.post('learner-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};