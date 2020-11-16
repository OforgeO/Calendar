import Axios from 'axios';
import {URLS} from './URLS';

let base_url = URLS;
let _headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export const login = (data) => Axios.post(URLS.LOGIN, data);
