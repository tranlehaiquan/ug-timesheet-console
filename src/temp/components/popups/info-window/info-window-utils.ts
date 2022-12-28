import { min, max, compact } from "lodash";

export interface ICursorPoints {
  x: number;
  y: number;
}

export interface ICursorOptions {
  rule: "follow" | "follow-x" | "follow-y";
  keepOnMouseMove?: boolean;
}

export type Position = "top" | "right" | "bottom" | "left";

export const getPositionEvalOrder = (position: Position): Position[] => {
  switch (position) {
    case "top":
      return ["top", "left", "right", "bottom"];
    case "right":
      return ["right", "top", "bottom", "left"];
    case "bottom":
      return ["bottom", "left", "right", "top"];
    case "left":
      return ["left", "top", "bottom", "right"];
    default:
      return ["top", "right", "bottom", "left"];
  }
};

interface IAnchorPoint {
  position: Position;
  point: ICursorPoints;
}

export interface IAnchorScores extends IAnchorPoint {
  display: ClientRect;
  displayScore: number;
  distanceScore: number;
  weightedScore: number;
}

export const getAnchorPoints = (
  triggerPoint: ICursorPoints,
  triggerRect: ClientRect,
  triangleRect: ClientRect,
  windowRect: ClientRect,
  cursorOptions: ICursorOptions
): IAnchorPoint[] => {
  const evalHorizontalAxisPosition = (position: Position) => {
    // closest point to the trigger point if we're in follow mode
    if (
      cursorOptions &&
      (cursorOptions.rule === "follow" || cursorOptions.rule === "follow-x")
    ) {
      return {
        x: triggerPoint.x,
        y:
          cursorOptions.rule === "follow"
            ? triggerPoint.y
            : triggerRect[position],
      };
    }

    // otherwise return half of the trigger rect
    const triggerMidPoint = triggerRect.left + triggerRect.width / 2;
    if (triggerMidPoint < 0) {
      return {
        x: 0,
        y: triggerRect[position],
      };
    } else if (triggerMidPoint > window.innerWidth) {
      return {
        x: window.innerWidth,
        y: triggerRect[position],
      };
    }

    return {
      x: triggerMidPoint,
      y: triggerRect[position],
    };
  };

  const evalVerticalAxisPosition = (position: Position) => {
    // closest point to the trigger point if we're in follow mode
    if (
      cursorOptions &&
      (cursorOptions.rule === "follow" || cursorOptions.rule === "follow-y")
    ) {
      return {
        x:
          cursorOptions.rule === "follow"
            ? triggerPoint.x
            : triggerRect[position],
        y: triggerPoint.y,
      };
    }

    // otherwise return half of the trigger rect
    const triggerMidPoint = triggerRect.top + triggerRect.height / 2;
    if (triggerMidPoint < 0) {
      return {
        x: triggerRect[position],
        y: 0,
      };
    } else if (triggerMidPoint > window.innerHeight) {
      return {
        x: triggerRect[position],
        y: window.innerHeight,
      };
    }

    return {
      x: triggerRect[position],
      y: triggerMidPoint,
    };
  };

  return [
    { position: "top" as Position, point: evalHorizontalAxisPosition("top") },
    { position: "left" as Position, point: evalVerticalAxisPosition("left") },
    {
      position: "bottom" as Position,
      point: evalHorizontalAxisPosition("bottom"),
    },
    { position: "right" as Position, point: evalVerticalAxisPosition("right") },
  ];
};

export const getPositionScores = (
  triggerPoint: ICursorPoints,
  triggerRect: ClientRect,
  contentRect: ClientRect,
  triangleRect: ClientRect,
  windowRect: ClientRect,
  cursorOptions: ICursorOptions,
  anchorOffset: number = 0
): IAnchorScores[] => {
  const anchorPoints = getAnchorPoints(
    triggerPoint,
    triggerRect,
    triangleRect,
    windowRect,
    cursorOptions
  ).map(applyAnchorOffset(anchorOffset));

  const displays = anchorPoints.map((anchor) => {
    const displayCoords = getDisplayCoordinates(
      anchor,
      contentRect,
      triangleRect
    );
    return {
      ...anchor,
      display: {
        ...displayCoords,
        width: displayCoords.right - displayCoords.left,
        height: displayCoords.bottom - displayCoords.top,
      },
    };
  });

  const displayScores = displays.map((anchor) => {
    const intersection = calculateIntersectionArea(anchor.display, windowRect);

    const intersectionArea =
      (intersection.right - intersection.left) *
      (intersection.bottom - intersection.top);
    const displayArea = anchor.display.width * anchor.display.height;

    return {
      ...anchor,
      intersection,
      displayScore: intersectionArea / displayArea,
    };
  });

  const distanceScores = displayScores.map((anchor) => {
    const distanceFromAnchor = Math.sqrt(
      Math.pow(anchor.point.x - triggerPoint.x, 2) +
        Math.pow(anchor.point.y - triggerPoint.y, 2)
    );

    return {
      ...anchor,
      distanceScore: distanceFromAnchor,
    };
  });

  return distanceScores
    .map((anchor) => {
      return {
        ...anchor,
        weightedDisplayScore: anchor.displayScore,
        weightedDistanceScore: getWeightedDistanceScore(anchor.distanceScore),
      };
    })
    .map((anchor) => {
      return {
        ...anchor,
        weightedScore:
          anchor.weightedDisplayScore - anchor.weightedDistanceScore,
      };
    });
};

export const getBestFit = (
  desiredOrder: Position[],
  positionScores: IAnchorScores[]
): IAnchorScores => {
  const startingDisplayThreshold = 1;

  const bestPositions = scanAnchorsForBestFit(
    positionScores,
    startingDisplayThreshold
  );

  if (bestPositions.length === 0) {
    return positionScores[0];
  }

  const bestPositionsInDesiredOrder = compact(
    desiredOrder.map((position) =>
      bestPositions.find((anchor) => anchor.position === position)
    )
  );

  return bestPositionsInDesiredOrder[0];
};

export const adjustContentDisplayCoordinates = (
  anchor: IAnchorScores,
  windowRect: ClientRect
) => {
  const intersection = calculateIntersectionArea(anchor.display, windowRect);

  if (anchor.position === "top" || anchor.position === "bottom") {
    const moveX =
      anchor.display.right > intersection.right
        ? (anchor.display.right - intersection.right) * -1
        : intersection.left - anchor.display.left;

    return {
      ...anchor,
      display: {
        ...anchor.display,
        left: anchor.display.left + moveX,
        right: anchor.display.right + moveX,
      },
    };
  }
  {
    const moveY =
      anchor.display.bottom > intersection.bottom
        ? (anchor.display.bottom - intersection.bottom) * -1
        : intersection.top - anchor.display.top;

    return {
      ...anchor,
      display: {
        ...anchor.display,
        top: anchor.display.top + moveY,
        bottom: anchor.display.bottom + moveY,
      },
    };
  }
};

const applyAnchorOffset = (anchorOffset: number) => (anchor: IAnchorPoint) => {
  switch (anchor.position) {
    case "top":
      return {
        ...anchor,
        point: {
          ...anchor.point,
          y: anchor.point.y + anchorOffset,
        },
      };
    case "bottom":
      return {
        ...anchor,
        point: {
          ...anchor.point,
          y: anchor.point.y - anchorOffset,
        },
      };
    case "left":
      return {
        ...anchor,
        point: {
          ...anchor.point,
          x: anchor.point.x + anchorOffset,
        },
      };
    case "right":
      return {
        ...anchor,
        point: {
          ...anchor.point,
          x: anchor.point.x - anchorOffset,
        },
      };
    default:
      return anchor;
  }
};

const getWeightedDistanceScore = (
  distance: number,
  threshold: number = 100,
  currentScore: number = 0.05
): number => {
  if (currentScore >= 1) {
    return 1;
  }

  if (distance < threshold) {
    return currentScore;
  }

  return getWeightedDistanceScore(
    distance,
    threshold * 1.5,
    currentScore * 1.75
  );
};

const calculateIntersectionArea = (
  innerRect: ClientRect,
  outerRect: ClientRect
) => {
  // const SPACER_UNIT = 6
  // const outerWithPadding = {
  //   top: outerRect.top + SPACER_UNIT,
  //   right: outerRect.right - SPACER_UNIT,
  //   bottom: outerRect.bottom - SPACER_UNIT,
  //   left: outerRect.left + SPACER_UNIT
  // }

  return {
    top: max([outerRect.top, innerRect.top]),
    left: max([outerRect.left, innerRect.left]),
    bottom: min([outerRect.bottom, innerRect.bottom]),
    right: min([outerRect.right, innerRect.right]),
  };
};

const scanAnchorsForBestFit = (
  positionScores: IAnchorScores[],
  threshold: number,
  rangeIncriment: number = 0.05
): IAnchorScores[] => {
  if (threshold <= -1) {
    return [];
  }

  const scoresPassing = positionScores.filter(
    (position) => position.weightedScore > threshold
  );

  if (scoresPassing.length > 0) {
    return scoresPassing;
  }
  return scanAnchorsForBestFit(
    positionScores,
    threshold - rangeIncriment,
    rangeIncriment * 1.5
  );
};

const getDisplayCoordinates = (
  anchor: IAnchorPoint,
  contentRect: ClientRect,
  triangleRect: ClientRect
) => {
  const { point, position } = anchor;
  const halfWidth = contentRect.width / 2;
  const halfHeight = contentRect.height / 2;
  const halfTriangle = triangleRect.height / 2;

  switch (position) {
    case "top":
      return {
        top: point.y - (contentRect.height + halfTriangle),
        left: point.x - halfWidth,
        right: point.x + halfWidth,
        bottom: point.y - halfTriangle,
      };
    case "bottom":
      return {
        top: point.y + halfTriangle,
        left: point.x - halfWidth,
        right: point.x + halfWidth,
        bottom: point.y + (contentRect.height + halfTriangle),
      };
    case "left":
      return {
        top: point.y - halfHeight,
        left: point.x - (contentRect.width + halfTriangle),
        right: point.x - halfTriangle,
        bottom: point.y + halfHeight,
      };
    case "right":
      return {
        top: point.y - halfHeight,
        left: point.x + halfTriangle,
        right: point.x + (contentRect.width + halfTriangle),
        bottom: point.y + halfHeight,
      };
  }
};

export const notTargetAreas = (
  elements: (Element | HTMLElement)[],
  e: MouseEvent
) => {
  const target = e.target as Node;
  return elements.every(
    (element) => !element || (target !== element && !element.contains(target))
  );
};
