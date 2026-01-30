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

export const GET_LAST_LOGIN = async (body) => {
    try {
        const response = await Axios.post('get-last-login/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const USER_INFO = async (body) => {
    try {
        const response = await Axios.post('user-info/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

// LEARNER API FOR ADMIN
export const LEARNER_LIST = async (body) => {
    try {
        const response = await Axios.post('learner-list/', body);
        return response;
    } catch (error) {
        console.error(error);
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



//INSTRUCTOR API
export const INSTRUCTOR_LIST = async (body) => {
    try {
        const response = await Axios.post('instructor-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const ADD_INSTRUCTOR = async (body) => {
    try {
        const response = await Axios.post("add-instructor/", body, {
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


export const EDIT_INSTRUCTOR = async (body) => {
    try {
        const response = await Axios.post('edit-instructor/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_INSTRUCTOR = async (body) => {
    try {
        const response = await Axios.post('view-instructor/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


//COURSE API
export const ADD_COURSE = async (body) => {
    try {
        const response = await Axios.post('add-course/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EDIT_COURSE = async (body) => {
    try {
        const response = await Axios.post('edit-course/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_COURSE = async (body) => {
    try {
        const response = await Axios.post('view-course/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const COURSE_LIST = async (body) => {
    try {
        const response = await Axios.post('course-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DELETED_COURSE_LIST = async (body) => {
    try {
        const response = await Axios.post('list-deleted-course/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const COURSE_STATUS = async (body) => {
    try {
        const response = await Axios.post('course-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DELETE_COURSE = async (body) => {
    try {
        const response = await Axios.post('delete-course/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const BULK_ASSIGN_COURSE = async (body) => {
    try {
        const response = await Axios.post('bulk-assign-course/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const UPDATE_CHAPTER_PROGRESS = async (body) => {
    try {
        const response = await Axios.post('update-chapter-progress/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};




//CHAPTER API
export const ADD_CHAPTER = async (body) => {
    try {
        const response = await Axios.post('add-chapter/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_ASSIGNMENT = async (body) => {
    try {
        const response = await Axios.post('add-assignment/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_CHAPTER = async (body) => {
    try {
        const response = await Axios.post('edit-chapter/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_CHAPTER = async (body) => {
    try {
        const response = await Axios.post('view-chapter/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const CHAPTER_LIST = async (body) => {
    try {
        const response = await Axios.post('chapter-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const CHAPTER_STATUS = async (body) => {
    try {
        const response = await Axios.post('chapter-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_ASSIGNMENT = async (body) => {
    try {
        const response = await Axios.post('view-assignment/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_ASSIGNMENT = async (body) => {
    try {
        const response = await Axios.post('edit-assignment/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const Add_LIVE_TEST = async (body) => {
    try {
        const response = await Axios.post('add-live-test/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_LIVE_TEST = async (body) => {
    try {
        const response = await Axios.post('edit-live-test/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};
export const VIEW_LIVE_TEST = async (body) => {
    try {
        const response = await Axios.post('view-live-test/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

// QUestion API 


export const Add_LIVE_TEST_QUESTION = async (body) => {
    try {
        const response = await Axios.post('add-test-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_LIVE_TEST_QUESTION = async (body) => {
    try {
        const response = await Axios.post('edit-test-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};
export const VIEW_LIVE_TEST_QUESTION = async (body) => {
    try {
        const response = await Axios.post('view-test-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_LIVE_TEST_QUESTION = async (body) => {
    try {
        const response = await Axios.post('list-test-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DELETE_LIVE_TEST_QUESTION = async (body) => {
    try {
        const response = await Axios.post('delete-live-test-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



//SECTION API
export const ADD_CHAPTER_SECTION = async (body) => {
    try {
        const response = await Axios.post('add-section-view/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_CHAPTER_SECTION = async (body) => {
    try {
        const response = await Axios.post('edit-section-view/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_CHAPTER_SECTION = async (body) => {
    try {
        const response = await Axios.post('view-chapter-section/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DELETE_STATUS = async (body) => {
    try {
        const response = await Axios.post('delete-section/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const CHAPTER_SECTION_LIST = async (body) => {
    try {
        const response = await Axios.post('chapter-section-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_SECTION_VIDEO = async (body) => {
    try {
        const response = await Axios.post('add-section-video/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_SECTION_MEDIA = async (body) => {
    try {
        const response = await Axios.post('view-section-media/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EDIT_SECTION_MEDIA = async (body) => {
    try {
        const response = await Axios.post('edit-section-media/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



//Media API
export const MEDIA_IMAGE_LISTING = async (body) => {
    try {
        const response = await Axios.post('media-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const SECTION_VIDEO_LIST = async (body) => {
    try {
        const response = await Axios.post('list-section-videos/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const DELETE_SELECT_VIDEO = async (body) => {
    try {
        const response = await Axios.post('delete-section-video/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};
//QUIZ  APIS
export const ADD_QUIZ_SETTIING = async (body) => {
    try {
        const response = await Axios.post('add-quiz-setting/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_QUIZ_SETTIING = async (body) => {
    try {
        const response = await Axios.post('edit-quiz-setting/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_QUIZ_SETTIING = async (body) => {
    try {
        const response = await Axios.post('view-quiz-setting/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_QUIZ_QUESTION = async (body) => {
    try {
        const response = await Axios.post('view-quiz-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_QUIZ_QUESTION = async (body) => {
    try {
        const response = await Axios.post('add-quiz-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EDIT_QUIZ_QUESTION = async (body) => {
    try {
        const response = await Axios.post('edit-quiz-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const List_QUIZ_QUESTION = async (body) => {
    try {
        const response = await Axios.post('list-quiz-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const DELETE_QUIZ_QUESTION = async (body) => {
    try {
        const response = await Axios.post('delete-quiz-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const BULK_QUIZ_QUESTION = async (body) => {
    try {
        const response = await Axios.post('bulk-add-quiz-questions/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



//Package APIS.
export const ADD_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('add-package/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('list-package/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('edit-package/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('view-package/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const BULK_ASSIGN_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('bulk-assign-package/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ASSIGN_COURSE = async (body) => {
    try {
        const response = await Axios.post('assign-course/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_COURSE_LEANERS = async (body) => {
    try {
        const response = await Axios.post('list-course-learners/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LEANERS_COURSE_STATUS = async (body) => {
    try {
        const response = await Axios.post('learner-course-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};




export const ASSIGN_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('assign-package/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_PACKAGE_LEARNERS = async (body) => {
    try {
        const response = await Axios.post('list-package-learners/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const LIST_PACKAGE_COURSES = async (body) => {
    try {
        const response = await Axios.post('list-package-courses/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const ASSIGN_PACKAGE_COURSES = async (body) => {
    try {
        const response = await Axios.post('assign-course-to-package/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const LEARNER_PACKAGE_STATUS = async (body) => {
    try {
        const response = await Axios.post('learner-package-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const BULK_ASSIGN_MULTI_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('bulk-assign-multi-package/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};




export const ADD_VIDEO_VIEW = async (body) => {
    try {
        const response = await Axios.post('add-video-view/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};
export const EDIT_VIDEO_VIEW = async (body) => {
    try {
        const response = await Axios.post('edit-video-view/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const LIST_VIDEO = async (body) => {
    try {
        const response = await Axios.post('list-videos/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DELETE_VIDEO = async (body) => {
    try {
        const response = await Axios.post('delete-video/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const GET_AWS_SIGN_UPLOAD_VIDEO = async (body) => {
    try {
        const response = await Axios.post('get-aws-sign-upload-video/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_LIVE_TESTS = async (body) => {
    try {
        const response = await Axios.post('list-live-tests/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_LIVE_SUBMISSION = async (body) => {
    try {
        const response = await Axios.post('list-live-submission/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


//REPORTS API

export const COURSE_REPORT = async (body) => {
    try {
        const response = await Axios.post('course-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const PACKAGE_REPORT = async (body) => {
    try {
        const response = await Axios.post('package-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const DOWNLOAD_PACKAGE_REPORT = async (body) => {
    try {
        const response = await Axios.post('download-package-excel/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const VIEW_LEARNER_REPORT = async (body) => {
    try {
        const response = await Axios.post('view-learner-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



//NOTIFICATION APIS 

export const ADD_NOTIFICATION = async (body) => {
    try {
        const response = await Axios.post('add-notification/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EDIT_NOTIFICATION = async (body) => {
    try {
        const response = await Axios.post('edit-notification/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};
export const VIEW_NOTIFICATION = async (body) => {
    try {
        const response = await Axios.post('view-notification/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_NOTIFICATION = async (body) => {
    try {
        const response = await Axios.post('list-notification/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const GENERATE_LIVE_TEST_RESULT = async (body) => {
    try {
        const response = await Axios.post('generate-live-test-result/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const UPDATE_QUIZE_SETTING_DATA = async (body) => {
    try {
        const response = await Axios.post('update-video-prog/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const LEANER_WATCHTIME= async (body) => {
    try {
        const response = await Axios.post('learner-watchtime-summary/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const NOTIFICATION_DROPDOWN= async (body) => {
    try {
        const response = await Axios.post('list-notification-dropdown/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const QUIZ_REPORT= async (body) => {
    try {
        const response = await Axios.post('quiz-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const LEARNER_QUIZ_REPORT= async (body) => {
    try {
        const response = await Axios.post('learner-quiz-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const QUIZ_ANSWER_DETAILS= async (body) => {
    try {
        const response = await Axios.post('quiz-answer-details/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const DOWNLOAD_QUIZ_REPORT= async (body) => {
    try {
        const response = await Axios.post('download-quiz-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const DOWNLOAD_REPORT= async (body) => {
    try {
        const response = await Axios.post('download-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_DOWNLOAD_REPORT= async (body) => {
    try {
        const response = await Axios.post('list-download-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const GET_DOWNLOAD_REPORT= async (body) => {
    try {
        const response = await Axios.post('get-download-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ASSIGN_LIVE_TEST_LEARNER= async (body) => {
    try {
        const response = await Axios.post('assign-live-test-learner/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_LIVE_TEST_LEARNERS= async (body) => {
    try {
        const response = await Axios.post('list-live-test-learners/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_LIVE_TEST_LEARNERS_STATUS= async (body) => {
    try {
        const response = await Axios.post('live-test-learner-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const BULK_ASSIGN_LIVE_TEST= async (body) => {
    try {
        const response = await Axios.post('bulk-assign-live-test-learners/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const NEWS_LIST= async (body) => {
    try {
        const response = await Axios.post('news-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_NEWS = async (body) => {
    try {
        const response = await Axios.post('add-news/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_NEWS = async (body) => {
    try {
        const response = await Axios.post('view-news/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EDIT_NEWS = async (body) => {
    try {
        const response = await Axios.post('edit-news/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const NEWS_STATUS = async (body) => {
    try {
        const response = await Axios.post('news-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const DELETE_NEWS = async (body) => {
    try {
        const response = await Axios.post('delete-news/', body);
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


export const LIST_SMTP = async (body) => {
    try {
        const response = await Axios.post('list-smtp/', body);
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


export const SMTP_STATUS = async (body) => {
    try {
        const response = await Axios.post('smtp-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};




export const BULK_ASSIGN_PACKAGE_COURSE_TEMPLATE = async (body) => {
    try {
        const response = await Axios.post('bulk-assign-package-course-template/', body, {
        responseType: "blob",
      });
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const BULK_IMPORT_QUIZ_QUESITON_TEMPLATE = async (body) => {
    try {
        const response = await Axios.post('bulk-import-quiz-question-template/', body, {
        responseType: "blob",
      });
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const BULK_ADD_LEARNER_TEMPLATE = async (body) => {
 try {
    const response = await Axios.post( 'bulk-add-learner-template/',body,
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



export const LIST_DOWNLOAD_QUIZ_TEST_REPORT = async (body) => {
    try {
        const response = await Axios.post('list-download-quiz-test-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_DOWNLOAD_PACKAGE_REPORT = async (body) => {
    try {
        const response = await Axios.post('list-download-package-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_DOWNLOAD_COURSE_REPORT = async (body) => {
    try {
        const response = await Axios.post('list-download-course-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_DOWNLOAD_LIVE_TEST_REPORT = async (body) => {
    try {
        const response = await Axios.post('list-download-live-test-report/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const LIST_TRAININGS = async (body) => {
    try {
        const response = await Axios.post('list-trainings/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_TRAININGS = async (body) => {
    try {
        const response = await Axios.post('add-trainings/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const EDIT_TRAININGS = async (body) => {
    try {
        const response = await Axios.post('edit-trainings/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_TRAININGS = async (body) => {
    try {
        const response = await Axios.post('view-trainings/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const TRAININGS_STATUS = async (body) => {
    try {
        const response = await Axios.post('trainings-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const DELETE_TRAININGS = async (body) => {
    try {
        const response = await Axios.post('delete-trainings/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};


export const ADD_CITY = async (body) => {
    try {
        const response = await Axios.post('add-city-forum/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const LIST_CITY = async (body) => {
    try {
        const response = await Axios.post('city-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const EDIT_CITY = async (body) => {
    try {
        const response = await Axios.post('edit-city-forum/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const VIEW_CITY = async (body) => {
    try {
        const response = await Axios.post('view-city-forum/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const STATUS_CITY = async (body) => {
    try {
        const response = await Axios.post('city-forum-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const ADD_TOPIC = async (body) => { 
    try {
        const response = await Axios.post('add-topic-forum/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const LIST_TOPIC = async (body) => { 
    try {
        const response = await Axios.post('topic-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const EDIT_TOPIC = async (body) => { 
    try {
        const response = await Axios.post('edit-topic-forum/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};

export const VIEW_TOPIC = async (body) => { 
    try {
        const response = await Axios.post('view-topic-forum/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};


export const STATUS_TOPIC = async (body) => { 
    try {
        const response = await Axios.post('topic-forum-status/', body);
        return response;
    } catch (error) {
        console.error(error);
    }  
};
