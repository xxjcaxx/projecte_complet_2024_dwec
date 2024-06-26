import { BehaviorSubject } from "rxjs";

export const state = new BehaviorSubject({
    search: [],
    function: ()=>{}
  });
  /*
let stateSubscription = state.subscribe(currentState => {
  
});
  */