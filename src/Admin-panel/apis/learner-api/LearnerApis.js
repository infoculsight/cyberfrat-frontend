// LearnerApi.js
import Axios from "../../config/config";

export const LEARNER_LIST = async (body) => {
  try {
    const response = await Axios.post("learner-list/", body);
    return response;
  } catch (error) {
    console.error( error);
  }
};



export const EDIT_LEARNER = async (body) => {
    try {
        const response = await Axios.post('edit-learner/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_LEARNER = async (body) => {
    try {
        const response = await Axios.post('view-learner/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LEARNER_STATUS = async (body) => {
    try {
        const response = await Axios.post('learner-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const ADD_LEARNER = async (body, token) => {
    try {
        const response = await Axios.post("add-learner/", body, {
            headers: {
                "Content-Type": "multipart/form-data", // 
            },
        });
        return response;
    } catch (error) {
        console.error("ADD_LEARNER ERROR:", error?.response?.data || error.message);
        throw error;
    }
};

export const LIST_LEARNER_ALL_COURSES = async (body) => {
    try {
        const response = await Axios.post('list-learner-all-courses/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const BULD_ADD_LEARNERS = async (body) => {
    try {
        const response = await Axios.post('bulk-add-learner/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



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

export const LEARNER_GROUP_LIST = async (body) => {
    try {
        const response = await Axios.post('learner-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const CHANGE_LEARNER_PASSWORD = async (body) => {
    try {
        const response = await Axios.post('change-learner-password/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const LIST_LEARNER_ALL_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('list-learner-all-packages/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_LEARNER_PACKAGE_REPORT = async (body) => {
    try {
        const response = await Axios.post('view-learner-package-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DISCUSSION_ACCESS = async (body) => {
    try {
        const response = await Axios.post('discussion-access-view/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const LIST_APP_DISCUSSION = async (body) => {
    try {
        const response = await Axios.post('list-app-dicussion/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_DISSCUSSION_REPLY = async (body) => {
    try {
        const response = await Axios.post('list-discussion-reply/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DISSCUSSION_STATUS = async (body) => {
    try {
        const response = await Axios.post('discussion-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_COMMENTS = async (body) => {
    try {
        const response = await Axios.post('list-comments/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const COMMENTS_STATUS = async (body) => {
    try {
        const response = await Axios.post('comments-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};
