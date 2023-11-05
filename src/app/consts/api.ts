import { environment } from 'src/environments/environment';

export class API {
  public static URL = {
    ACCOUNTS: `${environment.apiServer}/api/Accounts`,
    TIMESHEET: `${environment.apiServer}/api/Timesheet`,
  };
}
