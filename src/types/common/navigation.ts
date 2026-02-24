import { Plan } from './plan';

export interface LocationState {
  planStatus?: string;
  planInfo?: Plan;
  fromPath?: string;
}