import { BehaviorSubject } from "rxjs";

export const state = new BehaviorSubject({
  search: "",
  route: {},
});
