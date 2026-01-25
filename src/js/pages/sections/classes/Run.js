import Route from "./Route";
import ScoreSheet from "./ScoreSheet";

export default class Run {
  route = null;
  currentRouteIndex = 0;
  constructor() {}

  init() {
    this.route = new Route(config.routes[this.currentRouteIndex]);
    this.route.init();
  }
}

const config = {
  routes: [
    {
      name: "Beginner Route",
      stages: [
        {
          name: "Stage 1",
          toBeat: 120,
          lowers: ScoreSheet.getAllLowers(),
          uppers: ScoreSheet.getAllUppers(),
          rules: [],
          rounds: 5,
          handsPerRound: 3,
        },
      ],
    },
  ],
};
