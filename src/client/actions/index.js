import {
  CALL_API,
  Schemas
} from '../api/serverApi.js';

import loadSearchData from './search';
import loadCampaign from './campaign';
import loadLocationData from './location';
import loadTransactions from './transactions';
import loadDonors from './donors';
import { loadIndivs, loadPACinfo, loadBizInfo } from './donorCategories';
import loadStateInfo from './state';

export { loadSearchData, loadCampaign, loadLocationData, loadTransactions };
export { loadDonors, loadIndivs, loadPACinfo, loadBizInfo, loadStateInfo}



export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE
  }
}