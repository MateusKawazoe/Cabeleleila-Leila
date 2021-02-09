import {
    createStore
} from 'redux'

const INITIAL_STATE = {
    form: 0,
    signup: 0,
    token: '',
    username: '',
    admin: '',
    logged: 0
}

function form(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'CHANGE_STATE':
            return {
                ...state,
                form: action.form,
                signup: action.signup,
                token: action.token,
                username: action.username,  
                admin: action.admin,
                logged: action.logged
            }
            default:
                return state
    }
}

const store = createStore(form)

export default store