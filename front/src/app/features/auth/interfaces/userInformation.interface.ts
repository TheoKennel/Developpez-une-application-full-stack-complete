import {Subscription} from "../../articles/components/interface/subscription.interface";

export interface UserInformation {
  id: number;
  picture: string,
  userName: string;
  subscriptions: Subscription[] ;
}
