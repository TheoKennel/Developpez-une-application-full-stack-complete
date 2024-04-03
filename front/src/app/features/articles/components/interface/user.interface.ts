import {Subscription} from "./subscription.interface";

export interface User {
  email: string;
  username: string;
  subscription : Subscription[];
}
