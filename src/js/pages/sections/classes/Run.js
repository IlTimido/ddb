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
        // TAPPA 1: Tutorial / Warmup
        {
          name: "Stage 1",
          toBeat: 400,
          lowers: ScoreSheet.getAllLowers(),
          uppers: ScoreSheet.getAllUppers(),
          rules: [],
          rounds: 5,
          handsPerRound: 3,
        },
        // TAPPA 2: La sfida inizia (Serve strategia)
        {
          name: "Stage 2",
          toBeat: 850,
          lowers: ScoreSheet.getAllLowers(),
          uppers: ScoreSheet.getAllUppers(),
          rules: [],
          rounds: 5,
          handsPerRound: 3,
        },
        // TAPPA 3: Il Muro (Serve perfezione o combo)
        {
          name: "Stage 3",
          toBeat: 1600,
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
