import Axios from "../config/config";
export const LMS_STORAGE = '#';

export const LOGOUT_API = async (body) => {
  try {
      const response = await Axios.post('logout/', body);
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


//COURSE API

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


export const ADD_COURSE_TO_WISHLIST = async (body) => {
  try {
      const response = await Axios.post('add-course-to-wishlist/', body);
      return response;
  } catch (error) {
      console.error(error);
  }
};

export const LIST_WISHLIST_COURSES = async (body) => {
  try {
      const response = await Axios.post('list-wishlist-course/', body);
      return response;
  } catch (error) {
      console.error(error);
  }
};

export const ADD_COMMENT = async (body) => {
  try {
      const response = await Axios.post('add-comment/', body);
      return response;
  } catch (error) {
      console.error(error);
  }
};


export const LIST_COMMENT = async (body) => {
  try {
      const response = await Axios.post('list-comments/', body);
      return response;
  } catch (error) {
      console.error(error);
  }
};


//CHAPTER API
export const  ADD_CHAPTER = async (body) => {
  try {
      const response = await Axios.post('add-chapter/', body);
      return response;
  } catch (error) {
      console.error(error);
  }
};

export const  ADD_ASSIGNMENT = async (body) => {
  try {
      const response = await Axios.post('add-assignment/', body);
      return response;
  } catch (error) {
      console.error(error);
  }
};

export const  EDIT_CHAPTER = async (body) => {
  try {
      const response = await Axios.post('edit-chapter/', body);
      return response;
  } catch (error) {
      console.error(error);
  }
};


export const  VIEW_CHAPTER = async (body) => {
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

export const LIST_ENABLED_CHAPTER = async (body) => {
  try {
      const response = await Axios.post('list-enabled-chapter/', body);
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

export const CHAPTER_TEST_WITH_SCORE = async (body) => {
  try {
      const response = await Axios.post('chapter-test-with-score/', body);
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

export const CHAPTER_SECTION_LIST = async (body) => {
  try {
      const response = await Axios.post('chapter-section-list/', body);
      return response;
  } catch (error) {
      console.error(error);
  }
};

export const LIST_ENABLED_SECTION = async (body) => {
  try {
      const response = await Axios.post('list-enabled-section/', body);
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





//Media API
export const MEDIA_IMAGE_LISTING = async (body) => {
    try {
        const response = await Axios.post('media-list/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const SECTION_MEDIA_LIST = async (body) => {
    try {
        const response = await Axios.post('section-media-list/', body);
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

export const VIEW_QUIZ_SETTING = async (body) => {
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

export const QUIZ_RESULT_VIEW = async (body) => {
    try {
        const response = await Axios.post('quiz-result-view/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const CHAPTER_QUIZ_WITH_SCORE = async (body) => {
    try {
        const response = await Axios.post('chapter-quiz-with-score/', body);
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

export const LIST_ALL_PACKAGE = async (body) => {
    try {
        const response = await Axios.post('list-all-package/', body);
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

export const LIST_PACKAGE_COURSES = async (body) => {
    try {
        const response = await Axios.post('list-package-course/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_QUIZ_ANSWER = async (body) => {
    try {
        const response = await Axios.post('add-quiz-answer/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_QUIZ_SUBMISSION = async (body) => {
    try {
        const response = await Axios.post('add-quiz-submission/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_QUIZ_RESULT = async (body) => {
    try {
        const response = await Axios.post('view-quiz-result/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const QUIZ_ANSWER_DETAILS = async (body) => {
    try {
        const response = await Axios.post('quiz-answer-details/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const ADD_LIVE_TEST_SUBMISSION = async (body) => {
    try {
        const response = await Axios.post('add-live-test-submission/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const ADD_LIVE_TEST_ANSWERS = async (body) => {
    try {
        const response = await Axios.post('add-live-test-answers/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const VIEW_LIVE_TEST_RESULT = async (body) => {
    try {
        const response = await Axios.post('view-live-test-result/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const  VIEW_LIVE_TEST_DETAILS = async (body) => {
    try {
        const response = await Axios.post('view-live-test/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};




//SETTING USER API 
export const VIEW_PROFILE = async (body) => {
    try {
        const response = await Axios.post('view-profile/', body);
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

export const VIDEO_PLAYER_URL = async (body) => {
    try {
        const response = await Axios.post('video-player-url/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};
export const VIDEO_TRACK_PROGRESS = async (body) => {
    try {
        const response = await Axios.post('video-track-progress/', body);
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

export const START_QUIZ_QUESTION = async (body) => {
    try {
        const response = await Axios.post('start-quiz-question/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};




export const LEARNER_DASHBOARD = async (body) => {
    try {
        const response = await Axios.post('learner-dashboard/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const THEME_VIEW = async (body) => {
    try {
        const response = await Axios.post('theme-view/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const ADD_THEME_VIEW = async (body) => {
    try {
        const response = await Axios.post('add-theme-view/', body);
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

export const REMOVE_NOTIFICATION = async (body) => {
    try {
        const response = await Axios.post('delete-notification/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const ALL_REMOVE_NOTIFICATION = async (body) => {
    try {
        const response = await Axios.post('delete-all-notifications/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const UPDATE_CURRENT_CHAPTER = async (body) => {
    try {
        const response = await Axios.post('update-current-chapter/', body);
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


export const RESET_PASSWORD_REQUEST= async (body) => {
    try {
        const response = await Axios.post('reset-password-request/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const RESET_PASSWORD_TOKEN_CHECK= async (body) => {
    try {
        const response = await Axios.post('reset-password-token-check/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};



export const NEW_PASSWORD_SET= async (body) => {
    try {
        const response = await Axios.post('new-password-set/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};


export const EMAIL_VERIFY= async (body) => {
    try {
        const response = await Axios.post('email-verify/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const SET_TEMP_NEW_PASSWORD= async (body) => {
    try {
        const response = await Axios.post('set-temp-new-password/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};

export const LIST_LIVE_TESTS= async (body) => {
    try {
        const response = await Axios.post('list-live-tests/', body);
        return response;
    } catch (error) {
        console.error(error);
    }
};







